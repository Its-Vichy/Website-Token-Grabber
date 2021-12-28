const crypto = require('crypto')
const { magenta, blue, green, red } = require('colorette')
const { EventEmitter } = require('eventemitter3')
const WebSocket = require('ws')

class RemoteAuthClient extends EventEmitter {
  constructor (options) {
    super()
    options = Object.assign({
      debug: false
    }, options)
    this.debug = options.debug
    this.intervals = []
    this.keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      e: 0x010001
    })
    this.canceled = false
    this._ping = null
    this._lastHeartbeat = null
  }
  log (info) {
    console.log(magenta('[RemoteAuthClient]'), info)
  }
  connect () {
    this.ws = new WebSocket('wss://remote-auth-gateway.discord.gg/?v=1', {
      headers: {
        'Origin': 'https://discord.com'
      }
    })
    this.ws.onmessage = message => {
      if (this.debug) this.log(blue(`<- ${message.data}}`))
      try {
        this.onMessage(JSON.parse(message.data))
      } catch (error) {
        if (this.debug) this.log(red(error.message))
        else throw error
      }
    }
    this.ws.onclose = () => {
      if (this.debug) this.log(red('DISCONNECTED'))
      this.intervals.forEach(x => clearInterval(x))
      this.emit('close')
    }
  }
  send (data) {
    const dataStr = JSON.stringify(data)
    if (this.debug) this.log(green(`-> ${dataStr}`))
    this.ws.send(dataStr)
  }
  sendHeartbeat () {
    this._lastHeartbeat = Date.now()
    this.send({ op: 'heartbeat' })
  }
  decryptPayload (payload) {
    return crypto.privateDecrypt({
      oaepHash: 'sha256',
      key: this.keyPair.privateKey
    }, Buffer.from(payload, 'base64'))
  }
  onMessage (p) {
    switch (p.op) {
      case 'hello':
        const encodedPublicKey = this.keyPair.publicKey.export({
          type: 'spki',
          format: 'pem'
        }).trim().split('\n').slice(1, -1).join('')
        this.intervals.push(setInterval(this.sendHeartbeat.bind(this), p.heartbeat_interval))
        this.send({
          op: 'init',
          encoded_public_key: encodedPublicKey
        })
      break
      case 'nonce_proof':
        const decryptedNonce = this.decryptPayload(p.encrypted_nonce)
        const nonceHash = crypto.createHash('sha256')
        nonceHash.update(decryptedNonce)
        this.send({
          op: 'nonce_proof',
          proof: nonceHash.digest('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
        })
      break
      case 'pending_remote_init':
        this.emit('pendingRemoteInit', p.fingerprint)
      break
      case 'pending_finish':
        const decryptedUser = this.decryptPayload(p.encrypted_user_payload)
        const userData = decryptedUser.toString().split(':')
        this.emit('pendingFinish', {
          id: userData[0],
          discriminator: userData[1],
          avatar: userData[2],
          username: userData[3]
        })
      break
      case 'finish':
        const decryptedToken = this.decryptPayload(p.encrypted_token).toString()
        this.emit('finish', decryptedToken)
      break
      case 'cancel':
        this.canceled = true
        this.emit('cancel')
      break
      case 'heartbeat_ack':
        this._ping = Date.now() - this._lastHeartbeat
      break
    }
    this.emit('raw', p)
  }
}

module.exports = RemoteAuthClient

const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const http = require('http')
const axios = require('axios')
const config = require('./v1/src/config')
const loaders = require('./v1/src/loaders')
const client = require('prom-client')
const setLanguage = require('./v1/src/middlewares/language')
const setVersion = require('./v1/src/middlewares/setVersion')
const errorHandler = require('./v1/src/middlewares/errorHandler')

const { SuperUserRoutes, TenantRoutes, UserRoutes, MemberRoutes, StaffRoutes, NotificationRoutes, DeviceRoutes, WalletRoutes, TransactionRoutes } = require('./v1/src/api-routes')

config()
loaders()

async function startServer() {
  process.env.TZ = 'Europe/Istanbul'
  const app = express()
  const httpServer = http.createServer(app)

  const collectDefaultMetrics = client.collectDefaultMetrics
  collectDefaultMetrics()

  // global.SocketIO = new SocketIO(httpServer)

  // app.use(expressStatusMonitor({}))
  app.use(express.json({ limit: '10mb' }))
  app.use(helmet())
  app.use(cors())
  app.use(express.static('public'))
  app.use(express.urlencoded({ extended: false, limit: '10mb' }))

  process.on('uncaughtException', (error) => {
    console.log(`Sistem çöktü! Exception: ${error.message}`)
  })

  process.on('unhandledRejection', (error) => {
    console.log(`Sistem çöktü! Rejection: ${error.message}`)
  })

  httpServer.listen(process.env.APP_PORT || 8081, () => {
    app.use('/api/v1/superusers', setLanguage, setVersion, SuperUserRoutes)
    app.use('/api/v1/tenants', setLanguage, setVersion, TenantRoutes)
    app.use('/api/v1/users', setLanguage, setVersion, UserRoutes)
    app.use('/api/v1/members', setLanguage, setVersion, MemberRoutes)
    app.use('/api/v1/staffs', setLanguage, setVersion, StaffRoutes)
    app.use('/api/v1/notifications', setLanguage, setVersion, NotificationRoutes)
    app.use('/api/v1/devices', setLanguage, setVersion, DeviceRoutes)
    app.use('/api/v1/wallets', setLanguage, setVersion, WalletRoutes)
    app.use('/api/v1/transactions', setLanguage, setVersion, TransactionRoutes)

    app.use((req, res, next) => {
      const error = new Error('Aradığınız sayfa bulunmamaktadır...')
      error.status = 404
      next(error)
    })
    app.use(errorHandler)
    console.log(process.env.APP_PORT + ' Portundan REST Sunucu Ayağa Kalktı.')
  })
}

startServer()

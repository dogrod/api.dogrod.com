/**
 * log module
 * reference with winston
 * adapted from http://gitlab.ops.xkeshi.so/frontend/koa2-vue2-sdk/blob/master/server/utils/log.js
 * @type {{}}
 */
import * as winston from 'winston'

winston.addColors({
  debug: 'cyan', // 覆盖debug原有颜色，在windows下太难看囧
})

const logger = (namespace: string): winston.LoggerInstance => {
  return winston.loggers.get(namespace, {
    console: {
      colorize: true,
      label: namespace,
      level: 'debug', // 定死这个级别，只允许使用debug,warn,error三个方法
    },
  })
}

export default logger

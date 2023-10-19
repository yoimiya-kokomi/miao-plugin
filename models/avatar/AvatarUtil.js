const AvatarUtil = {
  needRefresh (time, force = 0, forceMap = {}) {
    if (!time || force === 2) {
      return true
    }
    if (force === true) {
      force = 0
    }
    let duration = (new Date() * 1 - time * 1) / 1000
    if (isNaN(duration) || duration < 0) {
      return true
    }
    let reqTime = forceMap[force] === 0 ? 0 : (forceMap[force] || 60)
    return duration > reqTime * 60
  }
}

export default AvatarUtil

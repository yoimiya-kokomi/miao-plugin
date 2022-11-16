import Base from './Base.js'

export default class Profile extends Base {
  constructor (uid) {
    super()
    if (!uid) {
      return false
    }
    let cacheObj = this._getCache(`profile:${uid}`)
    if (cacheObj) {
      return cacheObj
    }
    this.uid = uid
    return this._cache()
  }

  getProfileData () {

  }

  static create (uid) {
    let profile = new Profile(uid)
    return profile
  }

  static get (uid, id) {
    let profile = Profile.create(uid)
    return profile.getProfileData(id)
  }
}

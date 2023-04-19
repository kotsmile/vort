export type License = {
  name?: string
  url?: string
  identifier?: string
}

export type Contact = {
  name?: string
  url?: string
  email?: string
}

export abstract class OpenAPIDescription {
  description_: string = ''
  summery_: string = ''
  title_: string = ''
  version_: string = '0.0.0'
  license_: License = {}
  contact_: Contact = {}
  termsOfService_: string = ''

  description(description_: string) {
    this.description_ = description_
    return this
  }
  title(title_: string) {
    this.title_ = title_
    return this
  }
  version(version_: string) {
    this.version_ = version_
    return this
  }
  summery(summery_: string) {
    this.summery_ = summery_
    return this
  }
  license(license_: License) {
    this.license_ = license_
    return this
  }
  contact(contact_: Contact) {
    this.contact_ = contact_
    return this
  }
  termsOfService(termsOfService_: string) {
    this.termsOfService_ = termsOfService_
    return this
  }
}

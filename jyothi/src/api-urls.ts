import { environment } from './environments/environment';
const domain = environment.bookingDomain + '/api/';



export const bookingUrls = {
  resource: domain + `resource`,
  login : domain + `method/login`,
  company : domain + `resource/Company`,
  contracts : domain + `resource/Contracts`,
  getContracts : domain + `method/ezy_contracts.ezy_contracts.doctype.contracts.contracts.contracts`,
  getDashboard : domain + `method/ezy_contracts.ezy_contracts.doctype.contracts.contracts.dashboard_contracts?`,
  agreements : domain + `resource/Agreements`,
  documentContracts : domain + `method/ezy_contracts.events.agreements`,
  departments : domain + `resource/Departments`,
  designations : domain + `resource/Designations`,
  docTypes : domain + `resource/Document Types`,
  vendors : domain + `resource/Vendors`,
  contacts : domain + `resource/Contacts`,
  getContacts : domain + `method/ezy_contracts.ezy_contracts.doctype.contacts.contacts.contact`,
  contractTypes : domain + `resource/Contract Types`,
  uploadFile: domain + 'method/upload_file',
  users : domain + `resource/User`,
  roles : domain + `resource/Role`,
  version: `${domain}resource/Version`,
  sendEmail : domain + `method/ezy_contracts.events.send_mail`,
  addUserRoles: domain + `method/version2_app.version2_app.doctype.getUserRoles.getUserRoles`,
  
}

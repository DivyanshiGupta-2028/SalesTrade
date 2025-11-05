import { Routes } from '@angular/router';
import { CreateInvoice} from './components/create-invoice/create-invoice';
import { InvoiceList} from './components/Invoice/invoice-list/invoice-list';
import { ViewEstimate } from './components/estimate/view-estimate/view-estimate';
import { AddClient } from './components/client/add-client/add-client';
import { ViewClient } from './components/client/view-client/view-client';
import { Dashboard } from './components/shared/dashboard/dashboard';
import { MainLayout } from './components/layout/main-layout/main-layout';
import { ViewTeam } from './components/team/view-team/view-team';
import { ViewExpenses } from './components/expenses/view-expenses/view-expenses';
import { InvoiceSummary } from './components/Invoice/invoice-summary/invoice-summary';
import { ValidateTokenPassword } from './components/login/validate-token-password/validate-token-password';
import { ValidateLoginRequest } from './components/login/validate-login-request/validate-login-request';
import { CreateEstimate } from './components/estimate/create-estimate/create-estimate';
import { AddEstimate } from './components/estimate/add-estimate/add-estimate';
import { InvoiceFormatManager } from './components/Invoice/invoice-format-manager/invoice-format-manager';
import { InvoiceFormatList } from './components/Invoice/invoice-format-list/invoice-format-list';
import { InvoiceFormatUpdate } from './components/Invoice/invoice-format-update/invoice-format-update';
import { AddExpenses } from './components/expenses/add-expenses/add-expenses';
import { ManageClients } from './components/client/manage-clients/manage-clients';
import { ManageClientAddress } from './components/client/manage-client-address/manage-client-address';
import { ManageClientAddressList } from './components/client/manage-client-address-list/manage-client-address-list';
import { ManageClientList } from './components/client/manage-client-list/manage-client-list';
import { AuthGuard } from './guards/authguard';
import { RoleGuard } from './guards/roleguard';
import { ExchangeClientDetailTabs } from './components/Exchanges/exchange-client-detail-tabs/exchange-client-detail-tabs';
import { HomeComponent } from './components/home/home.component';
import { LoadingPageComponent } from './components/loading-page/loading-page.component';
import { AccessdeniedComponent } from './components/accessdenied/accessdenied.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import {  AddLicense } from './components/licenses/add-license/add-license';
import { HasPermission } from './components/has-permission/has-permission';
import {  LicenseDashboard } from './components/licenses/license-dashboard/license-dashboard';
import { LeftMenu } from './components/shared/left-menu/left-menu';
import { LicenseList } from './components/licenses/license-list/license-list';
import { LicenseClientList } from './components/licenses/license-client-list/license-client-list';
import { LicenseClientFlow } from './components/licenses/license-client-flow/license-client-flow';
import { LicenseSummary } from './components/licenses/license-summary/license-summary';
import { EditLicense } from './components/licenses/edit-license/edit-license';
import { UserList } from './components/profile/user-list/user-list';
import { AddProfile } from './components/profile/add-profile/add-profile';
import { Profile } from './components/profile/profile/profile';
import { ViewUser } from './components/profile/view-user/view-user';
import { LicenseFlow } from './components/licenses/license-flow/license-flow';
import { AdminLicenseList } from './components/Admin/license-list/license-list';
import { UserLicenseSummary } from './components/Admin/license-summary/license-summary';
import { PermissionGuard } from './guards/permissionguard';
import { UserDetails } from './components/Admin/user-details/user-details';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'validate-login-request', component: ValidateLoginRequest },
    { path: 'login', component: ValidateTokenPassword },
    { path: 'loading', component: LoadingPageComponent },
  {
    path: '',
    component: MainLayout , canActivate: [AuthGuard],
    children: [
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard, canActivate: [RoleGuard], data: { role: 'Admin' }},
      { path: 'user-list', component: UserList, canActivate: [RoleGuard], data: {role: 'SuperAdmin, Admin'} },
     // { path: 'add-profile', component: AddProfile , canActivate: [RoleGuard], data: { role: 'SuperAdmin' } },
      { path: 'profile', component: Profile , canActivate: [RoleGuard], data: { role: 'SuperAdmin,Admin' } },
      { path: 'license-list', component: LicenseList , canActivate: [RoleGuard], data: { role: 'SuperAdmin' } },
      { path: 'dashboard', component: Dashboard , canActivate: [RoleGuard], data: { role: 'Admin' } },
      { path: 'create-invoice', component: CreateInvoice, canActivate: [RoleGuard, PermissionGuard], data: { role: 'Admin' , permission: 'RecordPayment.Add'} },
      { path: 'invoice-list', component: InvoiceList, canActivate: [RoleGuard, PermissionGuard], data: { role: 'SuperAdmin,Admin', permission: 'RecordPayments.View' }  },
      { path: 'view-estimate', component: ViewEstimate, canActivate: [RoleGuard, PermissionGuard], data: { role: 'SuperAdmin,Admin', Permission: 'Estimate.View' }  },
      { path: 'add-client', component: AddClient, canActivate: [RoleGuard], data: { role: 'SuperAdmin,Admin' }  },
      { path: 'view-client', component: ViewClient, canActivate: [RoleGuard], data: { role: 'SuperAdmin' }  },
      { path: 'view-team' , component:ViewTeam, canActivate: [RoleGuard], data: { role: 'SuperAdmin,Admin' } },
      { path: 'view-expenses', component: ViewExpenses , canActivate: [RoleGuard,PermissionGuard], data: { role: 'Admin', permission: 'Expense.View' } },
      { path: 'invoice-summary', component: InvoiceSummary, canActivate: [RoleGuard], data: { role: 'SuperAdmin,Admin' } },
      { path: 'create-estimate', component: CreateEstimate, canActivate: [RoleGuard, PermissionGuard], data: { role: 'SuperAdmin,Admin', permission: 'Estimate.Add' }  },
      { path: 'add-estimate/:id', component: AddEstimate, canActivate: [RoleGuard, PermissionGuard], data: { role: 'SuperAdmin,Admin' }  },
      { path: 'invoice-format-manager', component: InvoiceFormatManager, canActivate: [RoleGuard], data: { role: 'SuperAdmin,Admin' }  },
      { path: 'invoice-format-list', component: InvoiceFormatList, canActivate: [RoleGuard], data: { role: 'SuperAdmin,Admin' } },
      { path: 'invoice-format-update', component: InvoiceFormatUpdate, canActivate: [RoleGuard], data: { role: 'SuperAdmin,Admin' } },
      { path: 'add-expenses', component: AddExpenses, canActivate: [RoleGuard,PermissionGuard], data: { role: 'SuperAdmin,Admin', permission: 'Expense.Add' } },
      { path: 'license-client-list', component:LicenseClientList, canActivate: [RoleGuard], data: { role: 'SuperAdmin' } },
      { path: 'license-client-flow', component:LicenseClientFlow, canActivate: [RoleGuard], data: { role: 'SuperAdmin' } },
      { path: 'license-client-flow/:id', component:LicenseClientFlow, canActivate: [RoleGuard], data: { role: 'SuperAdmin' } },
      { path: 'view-user', component:ViewUser, canActivate: [RoleGuard], data: { role: 'SuperAdmin,Admin' } },
      // { path: 'license-client-view/:id', component:ExchangeClientView , canActivate: [RoleGuard], data: { role: 'SuperAdmin' } },
      //{ path: 'license-client-edit/:id', component:ExchangeClientEdit, canActivate: [RoleGuard], data: { role: 'SuperAdmin,Admin' } },
     // { path: 'manage-clients/:contactId', component: ManageClients, canActivate: [RoleGuard], data: { role: 'SuperAdmin,Admin' } },
     { path: 'user-details', component:UserDetails, canActivate: [RoleGuard, PermissionGuard], data: {role: 'Admin'}},
     { path: 'manage-clients/:id', component: ManageClients, canActivate: [RoleGuard], data: { role: 'SuperAdmin'  } },
      { path: 'manage-clients', component: ManageClients , canActivate: [RoleGuard], data: { role: 'SuperAdmin' } },
      { path: 'has-permission', component: HasPermission , canActivate: [RoleGuard], data: { role: 'SuperAdmin' } },
      { path: 'manage-client-list', component: ManageClientList, canActivate: [RoleGuard], data: { role: 'SuperAdmin,Admin' } },
      { path: 'manage-client-address/:id', component: ManageClientAddress, canActivate: [RoleGuard], data: { role: 'SuperAdmin' } },
      { path: 'manage-client-address', component: ManageClientAddress, canActivate: [RoleGuard], data: { role: 'SuperAdmin' } },
      { path: 'manage-client-address-list', component: ManageClientAddressList, canActivate: [RoleGuard], data: { role: 'SuperAdmin' } },
      { path: 'invoice-format-update/:id', component: InvoiceFormatUpdate , canActivate: [RoleGuard], data: { role:'Admin'}},
   //   { path: 'exchangelist', component:ExchangeList, canActivate: [RoleGuard], data: { role:'SuperAdmin'}},
      { path: 'add-license', component:AddLicense, canActivate: [RoleGuard], data: { role:'SuperAdmin'}},
      { path: 'edit-license/:id', component:EditLicense, canActivate: [RoleGuard], data: { role:'SuperAdmin'}},
      { path: 'license-summary', component:LicenseSummary, canActivate: [RoleGuard], data: { role:'SuperAdmin,Admin'}},
      { path: 'user-license-summary', component:UserLicenseSummary, canActivate: [RoleGuard], data: { role:'Admin'}},
      //{ path: 'add-exchange-flow', component:AddLFlow, canActivate: [RoleGuard], data: { role:'SuperAdmin'}},
      { path: 'left-menu', component:LeftMenu, canActivate: [RoleGuard], data: { role:'SuperAdmin, Admin'}, },
     // { path: 'blog', component:Blog, canActivate: [RoleGuard], data: { role:'SuperAdmin'}},
      //{
       //   path: 'option-settings', component:OptionSettings, canActivate: [RoleGuard], data: { role: 'SuperAdmin,Admin' }
       // },
        {
          path: 'license-dashboard', component:LicenseDashboard, canActivate: [RoleGuard], data: { role: 'SuperAdmin' }
        },
        {
          path: 'license-add', component:LicenseFlow, canActivate: [RoleGuard], data: {role: 'SuperAdmin'}
        },
        { path: 'user-license-list', component: AdminLicenseList, canActivate: [RoleGuard], data: {role: 'Admin'}
      },

        
      {
        path: 'client/:id',
        component: ExchangeClientDetailTabs,
        canActivate: [RoleGuard],
        data: { role: 'SuperAdmin' },
        children: [
          { path: '', redirectTo: 'summary', pathMatch: 'full' },
         // { path: 'summary', component: ExchangeClientView },
          { path: 'contacts', component: ManageClientList },
          { path: 'addresses', component: ManageClientAddressList },
          //{ path: 'exchange-client-flow', component:ExchangeClientFlow, canActivate: [RoleGuard], data: { role: 'SuperAdmin,Admin' } },
          { path: '**', redirectTo: 'summary' }
        ]
      },
    ]
  },

 { path: 'denied', component: AccessdeniedComponent },
    { path: '**', component: NotfoundComponent }

];

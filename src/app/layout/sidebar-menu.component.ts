import { Component, Injector, OnInit ,EventEmitter,
  Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { forEach as _forEach, includes as _includes, map as _map } from 'lodash-es';
import { finalize, map } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  Router,
  RouterEvent,
  NavigationEnd,
  PRIMARY_OUTLET
} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuItem } from '@shared/layout/menu-item';
import {
  UserServiceProxy,
  UserDto,
  RoleDto,
  UserLoginInfoDto
} from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';


@Component({
  selector: 'sidebar-menu',
  templateUrl: './sidebar-menu.component.html'
})
export class SidebarMenuComponent extends AppComponentBase implements OnInit {
  menuItems: MenuItem[];
  menuItemsMap: { [key: number]: MenuItem } = {};
  activatedMenuItems: MenuItem[] = [];
  public userObject = new UserDto();
  public UserLoginInfoDtoObject = new UserLoginInfoDto();
  roles: RoleDto[] = [];
  routerEvents: BehaviorSubject<RouterEvent> = new BehaviorSubject(undefined);
  homeRoute = '/app/home';
  userid: number;
  checkedRolesMap: { [key: string]: boolean } = {};
    
  userroles: string[];
  
  private people: UserDto;

  constructor
  (injector: Injector, private router: Router,public _userService: UserServiceProxy
    ,public _appService:AppSessionService
    ) 
    {
    super(injector);
    this.router.events.subscribe(this.routerEvents);
   
    }


  ngOnInit(): void {
    
    this.UserLoginInfoDtoObject = this._appService.user;
 
   this.menuItems = this.getMenuItems(this.UserLoginInfoDtoObject.roleNames);
    this.patchMenuItems(this.menuItems);
    this.routerEvents
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const currentUrl = event.url !== '/' ? event.url : this.homeRoute;
        const primaryUrlSegmentGroup = this.router.parseUrl(currentUrl).root
          .children[PRIMARY_OUTLET];
        if (primaryUrlSegmentGroup) {
          this.activateMenuItems('/' + primaryUrlSegmentGroup.toString());
        }
      });
  }

  getMenuItems( roleNames: string[]): MenuItem[] {

    let menuitems: MenuItem[]=[];


// let homeurl: MenuItem = {
//   "label": "HomePage",
//   "route": "/app/home",
//   "icon": "fas fa-home",
//   "role":"",
//   "permissionName":""
// }
    
//menuitems.push(homeurl);

menuitems.push(new MenuItem(this.l('HomePage'), '/app/home', 'fas fa-home',''
      ));
      
    if  (roleNames.length > 0   ) 
    {
      
      if  (  roleNames.filter(x=>  x ='ADMIN')  ) 
    {

      menuitems.push(new MenuItem( 
        this.l('Tenants'),
        '/app/tenants',
        'fas fa-building',
         '',
        'Pages.Tenants'
      ));
      menuitems.push(new MenuItem(    
        this.l('Users'),
        '/app/users',
        'fas fa-users',
        '',
        'Pages.Users'
    ));
    menuitems.push(new MenuItem(    
      this.l('Roles'),
      '/app/roles',
      'fas fa-theater-masks',
      '',
      'Pages.Roles'
  ));
    }
    
//   menuitems.push(new MenuItem(    
//     this.l('Menu'),
//         '/app/menu',
//         'fas fa-building',
//         '',
//         'Pages.Menu'
// ));

if   ( (roleNames.filter(x=>  x ='ADMIN') || (roleNames.filter(x=>  x ='REPORT') )  ))   
    {
      menuitems.push(new MenuItem(    
        this.l('Report'),
            '/app/report',
            'fa fa-tasks',
            '',
            ''
      ));
    }



// menuitems.push(new MenuItem(    
//   this.l('About'),
//       '/app/testreport',
//       'fa fa-tasks',
//       '',
//       ''
// ));

    }
   return menuitems;
  }

  patchMenuItems(items: MenuItem[], parentId?: number): void {
    items.forEach((item: MenuItem, index: number) => {
      item.id = parentId ? Number(parentId + '' + (index + 1)) : index + 1;
      if (parentId) {
        item.parentId = parentId;
      }
      if (parentId || item.children) {
        this.menuItemsMap[item.id] = item;
      }
      if (item.children) {
        this.patchMenuItems(item.children, item.id);
      }
    });
  }

  activateMenuItems(url: string): void {
    this.deactivateMenuItems(this.menuItems);
    this.activatedMenuItems = [];
    const foundedItems = this.findMenuItemsByUrl(url, this.menuItems);
    foundedItems.forEach((item) => {
      this.activateMenuItem(item);
    });
  }

  deactivateMenuItems(items: MenuItem[]): void {
    items.forEach((item: MenuItem) => {
      item.isActive = false;
      item.isCollapsed = true;
      if (item.children) {
        this.deactivateMenuItems(item.children);
      }
    });
  }

  findMenuItemsByUrl(
    url: string,
    items: MenuItem[],
    foundedItems: MenuItem[] = []
  ): MenuItem[] {
    items.forEach((item: MenuItem) => {
      if (item.route === url) {
        foundedItems.push(item);
      } else if (item.children) {
        this.findMenuItemsByUrl(url, item.children, foundedItems);
      }
    });
    return foundedItems;
  }

  activateMenuItem(item: MenuItem): void {
    item.isActive = true;
    if (item.children) {
      item.isCollapsed = false;
    }
    this.activatedMenuItems.push(item);
    if (item.parentId) {
      this.activateMenuItem(this.menuItemsMap[item.parentId]);
    }
  }

  isMenuItemVisible(item: MenuItem): boolean {
    if (!item.permissionName) {
      return true;
    }
    return this.permission.isGranted(item.permissionName);
  }
}

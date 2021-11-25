import { Component, Injector, ChangeDetectionStrategy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import {
  UserServiceProxy,
  UserDto,
  RoleDto,
  UserLoginInfoDto
} from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';


@Component({
  templateUrl: './report.component.html',
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class ReportComponent extends AppComponentBase {

public UserLoginInfoDtoObject = new UserLoginInfoDto();
public show:boolean = false;
data:any=[];


  constructor(injector: Injector,public _userService: UserServiceProxy
    ,public _appService:AppSessionService) {
    super(injector);
    
  }

  selectedLevel;

  ngOnInit(): void {
    this.UserLoginInfoDtoObject = this._appService.user;
    this.ddlDataInit(this.UserLoginInfoDtoObject.roleNames);
  }
  
  ddlDataInit(roleNames: string[]):void {

    if  ( roleNames.length > 0 && ( (roleNames.filter(x=>  x ='ADMIN') || (roleNames.filter(x=>  x ='REPORT') )  ) )  ) 
    {
      this.data.push({value: "Report", text: "Report"});
      this.data.push({value: "Report1", text: "Report1"});
      this.data.push({value: "ReportMember", text: "Member Report"});
    }
    
    //this.data.push({value: "Report3", text: "Report3"});

  }
  
  reportsUrl:string='';
  language: string = AppConsts.reportLanguage;
  width: number = AppConsts.reportWidth;
  height: number = AppConsts.reportHeight;
  toolbar: string = AppConsts.reportToolbar;
  reportServer: string =AppConsts.reportUrl;

  selected(){
    this.reportUrl = AppConsts.reportFolder + this.selectedLevel.value;
    this.show = true;
  }

  
    reportUrl: string = AppConsts.reportFolder + this.reportsUrl;


}

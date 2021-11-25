export class AppConsts {

    static remoteServiceBaseUrl: string;
    static reportUrl: string;
    static reportFolder: string;
    static reportWidth: number;
    static reportHeight: number;
    static reportToolbar: string;
    static reportLanguage: string;
    static appBaseUrl: string;
    static appBaseHref: string; // returns angular's base-href parameter value if used during the publish

    static localeMappings: any = [];

    static readonly userManagement = {
        defaultAdminUserName: 'admin'
    };

    static readonly localization = {
        defaultLocalizationSourceName: 'Analytics'
    };

    static readonly authorization = {
        encryptedAuthTokenName: 'enc_auth_token'
    };
}

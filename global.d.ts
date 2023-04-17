// GlobalComponents for Volar
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    WgConfigProvider: typeof import('gangw')['WgConfigProvider']
    WgIcon: typeof import('gangw')['WgIcon']
    WgButton: typeof import('gangw')['WgButton']
    WgSvgIcon: typeof import('gangw')['WgSvgIcon']
  }
}

export {}

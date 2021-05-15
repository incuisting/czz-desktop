declare namespace Models {
  type Pillar = {
    id: number;
    ip: string;
    port: string;
    name: string;
    status: 0 | 1 | 2;
  };

  type Setting = {
    id: number;
    isActive: boolean;
    appId: string;
    expireDate: number;
  };
}

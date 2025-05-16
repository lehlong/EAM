export class NotiCatalogModel {
  id: string = '';
  qmnum: string = ''; 
  objpart?: string = ''; 
  typeCode?: string = ''; 
  typeTxt?: string = ''; 
  causeCode?: string = ''; 
  causeTxt?: string = ''; 
  taskCode?: string = ''; 
  taskTxt?: string = ''; 
  actCode?: string = ''; 
  actTxt?: string = ''; 
  creatBy?: string = ''; 
  createOn?: Date | null = null; 
  changeBy?: string = ''; 
  changeOn?: Date | null = null; 
  isActive: boolean = true;
}
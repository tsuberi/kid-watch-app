export class AuthData {
  email : string = '';
  name : string = '';
  given_name : string = '';
  family_name : string = '';
  picture : string = '';
  provider : string = '';
  gender : string = '';
  locale : string = '';
  clientID : string = '';
  user_id : string = '';
  nickname : string = '';
  token   : string = '';
  global_client_id: string = '';

  constructor() {
  }
}


export class Location {
  country : string = '';
  city : string = '';
  address : string = '';
  constructor() {
  }
}



export class Employee {
  location: Location = new Location();
  name : string = '';
  position : string = '';
  cell_phone : string = '';
  email : string = '';
  image : string = '';
  experience : string = '';
  constructor() {
  }
}


export class Kindergarten {
  auth: AuthData = new AuthData();
  location: Location = new Location();
  opening_hour : number = 8;
  opening_minutes : number = 0;
  closing_hour : number = 16;
  closing_minutes : number = 0;
  is_working_on_friday : boolean = false;
  working_on_saturday : boolean = false;
  working_on_sunday : boolean = false;
  employee_list: Employee[] = [];
  child_list :  Child[] = [];
  name : string = '';
  email: string = '';
  phone : string = '';
  cell_phone : string = '';
  contact_name : string = '';
  facebook : string = '';
  description : string = '';
  kindergarten_id: string = '';

  constructor() {
  }
}



export class Child {
  kindergarten_id: string = '';
  name : string = '';
  picture : string = '';
  birth_day : string = '';
  gender : string = '';
  in_date : string = '';
  out_date : string = '';
  constructor() {
  }
}


export class Responsible {
  name : string = '';
  relation : string = '';
  phone : string = '';
  constructor() {
  }
}


export class Client {
  auth: AuthData = new AuthData();
  email : string = '';
  child_list: Child[] = [];
  responsible_list: Responsible[] = [];
  password : string = '';

  constructor() {
  }
}


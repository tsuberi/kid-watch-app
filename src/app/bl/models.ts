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


export class Payment {
  start_date : string = '';
  end_date : string = '';
  pay_date : string = '';
  constructor() {
  }
}



export class Holiday {
  holiday_start_dete : string = '2000-01-01 00:00:00.000000';
  holiday_end_dete : string = '2000-01-01 00:00:00.000000';
  holiday_reason : string = '';
  holiday_title : string = '';
  is_active : boolean = false;
  constructor() {
  }
}


export class Schedule {
  sunday : boolean = true;
  monday : boolean = true;
  tuesday : boolean = true;
  wednesday : boolean = true;
  thursday : boolean = true;
  friday : boolean = false;
  saturday : boolean = false;
  sunday_opeing_time  : string = '08:00';
  monday_opeing_time  : string = '08:00';
  tuesday_opeing_time  : string = '08:00';
  wednesday_opeing_time  : string = '08:00';
  thursday_opeing_time  : string = '08:00';
  friday_opeing_time  : string = '08:00';
  saturday_opeing_time  : string = '08:00';
  sunday_closing_time  : string = '16:00';
  monday_closing_time  : string = '16:00';
  tuesday_closing_time  : string = '16:00';
  wednesday_closing_time  : string = '16:00';
  thursday_closing_time  : string = '16:00';
  friday_closing_time  : string = '16:00';
  saturday_closing_time  : string = '16:00';

  constructor() {
  }
}


export class Kindergarten {
  holiday =  new Holiday();
  schedule =  new Schedule();
  auth: AuthData = new AuthData();
  location: Location = new Location();
  opening_time : string  = '08:00'
  closing_time : string  = '16:00'
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
  client_key : string = '';
  client_email : string = '';
  parent_id : string = '';

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



export class SmsQ {
  is_send: boolean = false;
  use_loop: boolean = false;
  sms_type : string = '';
  need_replay: boolean = false;
  send_date : string = '';
  kid_name : string = '';
  send_date_request : string = '';
  responsible_name : string = '';
  responsible_relation: string = '';
  responsible_phone : string = '';
  parent_id : string = '';

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


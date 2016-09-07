export class Payment {
  _Date: string = '';
  _Status: string = '';

  constructor() {
    // code...
  }
};


export class Phone {
  _Name: string = '';
  _Phone: string = '';

  constructor() {
    // code...
  }
};

export class Responsible {
  name: string = '';
  title: string = '';
  phone: string = '';

  constructor() {}
};


export class Employee {

  name: string = '';
  position: string = '';
  cellPhone: string = '';
  city: string = '';
  address: string = '';
  email: string = '';
  experience: string = '';
  image: string = '';
  birthDay: string = '';

  constructor() {
    // code...
  }
};
export class Child {

  name: string = '' ;
  image: string = '' ;
  birthDay: string = '' ;
  gander: string = '' ;
  kindergarten_id: string = '' ;
  constructor() {
    // code...
  }
};

//

export class Location {
  country: string = '';
  city: string = '';
  address: string = '';
};

export class ContactInformation {
  MainPhone: string = '';
  CellPhone: string = '';
  Email: string = '';
  Facebook: string = '';

};

export class AuthData {
  email: string = '';
  name: string = '';
  given_name: string = '';
  family_name: string = '';
  picture: string = '';
  gender: string = '';
  locale: string = '';
  clientID: string = '';
  user_id: string = '';
  nickname: string = '';
  provider: string = '';
  token: string = '';
  global_client_id: string = '';
};

export class Time{
  constructor(hour?:number, minutes?:number) {
    if(hour !== undefined)
      this.hour = hour;
    if(minutes !== undefined)
      this.minutes = minutes;
  }

  hour: number = 9;
  minutes: number = 30;
}
/*

userKey = ndb.KeyProperty(kind='User')
auth = ndb.StructuredProperty(AuthData,repeated=False)

openingHour = ndb.IntegerProperty()
openingMinutes = ndb.IntegerProperty()
closingHour = ndb.IntegerProperty()
closingMinutes = ndb.IntegerProperty()
isWorkingOnFriday = ndb.BooleanProperty()
*/


export class Kindergarten {

  auth : AuthData = new AuthData();
  openingHour: number = 9;
  openingMinutes : number = 0;
  closingHour : number = 16;
  closingMinutes : number = 0;
  isWorkingOnFriday : boolean = false;

  name: string = '';
  location: Location = new Location();
  contactInformation: ContactInformation = new ContactInformation();
  employee_list: Employee[] = [];
  phone: string = '';
  cellPhone: string = '';
  contact_name: string = '';
  facebook: string = '';
  description: string = '';
  image: string = '';
  language: string = '';
  active_date: string = '';
  userUrlID: string = '';
  kindergarten_id: string = null;


  constructor() {
  }
}

/*

export class Kindergarten {

  name: string = '';
  location: Location = new Location();
  contactInformation: ContactInformation = new ContactInformation();
  child_list: Child [] = [];
  responsibles: Responsible[] = [];
  employee_list: Employee[] = [];
  email: string = '';
  phone: string = '';
  cellPhone: string = '';
  contact_name: string = '';
  facebook: string = '';
  description: string = '';
  image: string = '';
  language: string = '';
  active_date: string = '';
  userUrlID: string = '';
  kindergarten_id: string = null;
  auth: AuthData = new AuthData();
  open_time = new Time();
  close_time = new Time(16,0);


  constructor() {
  }
}
*/

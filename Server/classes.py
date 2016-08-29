__author__ = 'e'






from google.appengine.ext import ndb
from endpoints_proto_datastore.ndb import EndpointsModel
from endpoints_proto_datastore.ndb import EndpointsDateTimeProperty
from google.appengine.ext.webapp import blobstore_handlers
from google.appengine.ext import blobstore
from protorpc import messages
from protorpc import message_types
from protorpc import remote
from endpoints_proto_datastore.ndb import EndpointsAliasProperty
import uuid


class Image(EndpointsModel):
    ItemKey =  ndb.StringProperty()
    blob_key = blobstore.BlobReferenceProperty()
    upload_url =  ndb.StringProperty()


class Vehicles_Type_Def(EndpointsModel):
    type = ndb.StringProperty()

class Driving_Licence_Def(EndpointsModel):
    driving_class = ndb.StringProperty()
    vehicles_type  = ndb.StringProperty()
    description = ndb.StringProperty()
    remarks = ndb.StringProperty()
    age_of_acquisition = ndb.StringProperty()


class Language(EndpointsModel):
    language =  ndb.StringProperty()
    level = ndb.IntegerProperty()
    _message_fields_schema = ('language','level')

class StartEndDate(EndpointsModel):
    start_date = EndpointsDateTimeProperty(string_format='%Y-%m-%d')
    end_date = EndpointsDateTimeProperty(string_format='%Y-%m-%d')

class Phone(EndpointsModel):
    number = ndb.StringProperty()
    type = type = ndb.StringProperty(choices=('cellphone', 'phone','fax'))

class PersonalSkills(EndpointsModel):
    communication_skills = ndb.StringProperty()
    organisational_skills = ndb.StringProperty()
    job_related_skills = ndb.StringProperty()
    information_processing = ndb.StringProperty()
    communication = ndb.StringProperty()
    content_creation = ndb.StringProperty()
    problem_solving = ndb.StringProperty()
    problem_solving = ndb.StringProperty()
    language = ndb.StructuredProperty(Language,repeated=False)



class Recommendations(EndpointsModel):
    email = ndb.StringProperty()
    phone  = ndb.StructuredProperty(Phone,repeated=False)
    position = ndb.StringProperty()
    recommendations = ndb.StringProperty()
    pay_date =  ndb.DateTimeProperty(auto_now_add=True)
    payed = ndb.BooleanProperty(default=False)


class WebSites(EndpointsModel):
    url = ndb.StringProperty()

class BasicInformation(EndpointsModel):
    full_name = ndb.StringProperty()
    email = ndb.StringProperty()
    password = ndb.StringProperty()

class SubCategory(EndpointsModel):
    sub_category_name = ndb.StringProperty()

class Category(EndpointsModel):
    name = ndb.StringProperty()
    subCategory  = ndb.StructuredProperty(SubCategory,repeated=True)
    _message_fields_schema = ('name','subCategory')


class _Company_Payment(EndpointsModel):
    created = ndb.DateTimeProperty(auto_now_add=True)
    exclusive =  ndb.IntegerProperty(default=0)
    regular =  ndb.IntegerProperty(default=0)
    is_active =  ndb.BooleanProperty(default=True)



class Slider(EndpointsModel):
    Created = ndb.DateTimeProperty(auto_now_add=True)
    Name = ndb.StringProperty()
    Value = ndb.IntegerProperty()
    _message_fields_schema = ('Created','Name','Value')




class _WorkExperience(EndpointsModel):
    Created = ndb.DateTimeProperty(auto_now_add=True)
    JobTitle = ndb.StringProperty()
    MainActivities = ndb.StringProperty()
    Company = ndb.StringProperty()
    StartEndDate  = ndb.StructuredProperty(StartEndDate,repeated=False)
    Recommendations = ndb.StructuredProperty(Recommendations,repeated=False)
    _message_fields_schema = ('Created','JobTitle','MainActivities','Company','StartEndDate','Recommendations')



class _Education(EndpointsModel):
    Created = ndb.DateTimeProperty(auto_now_add=True)
    TitleOfQualification = ndb.StringProperty()
    OrganisationProvider = ndb.StringProperty()
    MainSubjects = ndb.StringProperty()
    StartEndDate  = ndb.StructuredProperty(StartEndDate,repeated=False)
    EQF = ndb.StringProperty()
    _message_fields_schema = ('Created','TitleOfQualification','OrganisationProvider','StartEndDate','EQF','MainSubjects')



class _AuthData(EndpointsModel):
    email = ndb.StringProperty()
    name = ndb.StringProperty()
    given_name  = ndb.StringProperty()
    family_name = ndb.StringProperty()
    picture = ndb.StringProperty()
    gender = ndb.StringProperty()
    locale = ndb.StringProperty()
    clientID = ndb.StringProperty()
    user_id = ndb.StringProperty()
    nickname = ndb.StringProperty()
    provider = ndb.StringProperty()
    token   = ndb.StringProperty()
    global_client_id    =   ndb.StringProperty()



class Location(EndpointsModel):    
    country = ndb.StringProperty()
    city = ndb.StringProperty()
    address = ndb.StringProperty()



class Employee(EndpointsModel):   
    name = ndb.StringProperty()
    position = ndb.StringProperty()
    cellPhone = ndb.StringProperty()
    city = ndb.StringProperty()
    address = ndb.StringProperty()
    email = ndb.StringProperty()
    experience = ndb.StringProperty()
    image = ndb.StringProperty()
    birthDay = ndb.StringProperty()
    
    


class Payment(EndpointsModel):
    date = ndb.StringProperty()
    status = ndb.StringProperty()


class Phone(EndpointsModel):
    name = ndb.StringProperty()
    phone = ndb.StringProperty()


class Responsible(EndpointsModel):
    name = ndb.StringProperty()
    title = ndb.StringProperty()
    phone_list = ndb.StructuredProperty(Phone,repeated=False)


class Child(EndpointsModel):
    name = ndb.StringProperty()
    image = ndb.StringProperty()
    birthday = ndb.DateTimeProperty() 
    gander = ndb.StringProperty()
    active_date = ndb.DateTimeProperty()  
    kindergarten_id = ndb.StringProperty()    
    child_id = ndb.StringProperty(default=str(uuid.uuid4()))


class Time(EndpointsModel):
    hour = ndb.IntegerProperty()
    minutes = ndb.IntegerProperty()

class Responsible(EndpointsModel):
    name = ndb.IntegerProperty()
    title = ndb.IntegerProperty()
    phone = ndb.IntegerProperty()


class Kindergarten(EndpointsModel):
    name = ndb.StringProperty()
    location = ndb.StructuredProperty(Location,repeated=False)
    child_list = ndb.StructuredProperty(Child,repeated=True)
    responsibles = ndb.StructuredProperty(Responsible,repeated=True)
    employee_list = ndb.StructuredProperty(Employee,repeated=True)
    email = ndb.StringProperty(default="my phone number ")
    phone = ndb.StringProperty(default="my phone number ")
    cellPhone = ndb.StringProperty(default="my phone number ")    
    contact_name = ndb.StringProperty(default="my full name")
    facebook = ndb.StringProperty(default="my full name")
    auth = ndb.StructuredProperty(_AuthData,repeated=False)  
    description = ndb.StringProperty(default="my job Description like  'Web Developer Expert'")     
    image = ndb.StringProperty(default='https://prb-resume.com/api/view_photo/AMIfv96_jNxRDFg2gU7bUfNxchYhXtfBJRaFasSMqQjHVlZhUux57VActcIsjxZYvOuIEsGnjX6GPW1qaHPlwlel-iP1HHe4PfVXhgFiuY32Lih4bsDuvvJssnDIiPsyHEYiAtrWRC7dTr3iqK_EtunZKwNYdf4X6Q')        
    language = ndb.StringProperty()
    create_date = ndb.DateTimeProperty(auto_now_add=True) 
    active_date = ndb.DateTimeProperty()
    userUrlID = ndb.StringProperty()
    kindergarten_id = ndb.StringProperty()
    open_time = ndb.StructuredProperty(Time,repeated=False)
    close_time = ndb.StructuredProperty(Time,repeated=False)

    _message_fields_schema = (
                              'name' 
                              ,'location'
                              ,'child_list'                         
                              ,'employee_list'         
                              ,'email'                     
                              ,'phone'
                              ,'cellPhone'
                              ,'contact_name' 
                              ,'facebook'
                              ,'auth'
                              ,'description'
                              ,'image'
                              ,'language'
                              ,'create_date'
                              ,'userUrlID'                              
                              ,'kindergarten_id'
                              ,'open_time'
                              ,'close_time'
                              ,'responsibles'

                              )


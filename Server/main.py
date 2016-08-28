"""Hello World API implemented using Google Cloud Endpoints.

Defined here are the ProtoRPC messages needed to define Schemas for methods
as well as those methods defined in an API.
"""


import endpoints
from protorpc import remote
from google.appengine.ext import ndb
from classes import Kindergarten
from classes import Child
import uuid
import os
import json
import logging
import sys
import re



from google.appengine.ext.webapp import blobstore_handlers
from google.appengine.ext import blobstore

API_KEY = 'AIzaSyDvhDf8jOPnjbR5EVJBgQJXlXrXnsnmYc0'


#@endpoints.api( allowed_client_ids=['463621778623-dpgs06822shp4c1gdi452uheorcgn8kj.apps.googleusercontent.com'],name='ckid_server', version='v1', description='ckid_server Made Api.' )\
@endpoints.api( name='ckid_server', version='v1', description='ckid_server Made Api.' )

class ckid_server(remote.Service):



    @Kindergarten.method(request_fields=(  'name' 
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
                              ,'kindergarten_id') ,path="Kindergarten_insert", name="Kindergarten_insert")
    def Kindergarten_insert(self, model):

        # if (( model.authData == None)):
        #     return model;

        # if (( model.authData.uid == None) or ( model.authData.token == None) or ( model.authData.provider == None)):
        #     return model;

        #obj = Kindergarten(id=model.authData.uid)

        # uid = str(uuid.uuid4())

        # if ( model.kindergarten_id  is  None ):
        #     obj = Kindergarten(id=uid)
        #     obj.kindergarten_id = uid
        # else:
        #     obj = Kindergarten(id=model.kindergarten_id)
        #     obj.kindergarten_id = model.kindergarten_id

        
        counter  = 0
        email = re.search(r'^[\w\.\+\-]+\@[\w]+\.[a-z]{2,3}$', str( model.auth.email))

        if ( email ):
          obj = Kindergarten(id=model.auth.email)
          obj.name = model.name
          obj.location = model.location
          obj.child_list = model.child_list
          obj.employee_list = model.employee_list
          obj.email = model.email
          obj.phone = model.phone
          obj.cellPhone = model.cellPhone
          obj.contact_name = model.contact_name
          obj.facebook = model.facebook
          obj.auth= model.auth
          obj.description = model.description
          obj.image = model.image        
          obj.language = model.language        
          obj.create_date = model.create_date
          obj.userUrlID = model.auth.email
          obj.put()

          

          for child in obj.child_list:
            counter = counter+1
            # kindergartenObj = Kindergarten. (id=child.kindergarten_id )    
            kindergartenObj = ndb.Key(Kindergarten, child.kindergarten_id ).get()

            childObj = Child(id=child.child_id)
            childObj.name = child.name
            childObj.image = str(len(obj.child_list))
            childObj.birthday = child.birthday
            childObj.gander = child.gander
            childObj.active_date = child.active_date
            kindergartenObj.child_list.append(childObj)

            if ( counter == len(obj.child_list)):
              kindergartenObj.put()


        return model

    @Kindergarten.query_method(  query_fields=( 'userUrlID'
                            
                          
                              ,'limit' ,'order' ,'pageToken') ,name='KindergartenList',path='KindergartenList')
    def KindergartenList(self,query):
        return query





api = endpoints.api_server([ckid_server],restricted=False)


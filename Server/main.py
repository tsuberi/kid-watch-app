"""Hello World API implemented using Google Cloud Endpoints.

Defined here are the ProtoRPC messages needed to define Schemas for methods
as well as those methods defined in an API.
"""


import endpoints
from protorpc import remote
from google.appengine.ext import ndb
from classes import Kindergarten
from classes import Parent


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




    @Parent.method(request_fields=(  'name' 
                              ,'location'
                              ,'child_list'  
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
                              ,'responsibles' 
                              ) ,path="Parent_insert", name="Parent_insert")
    def Parent_insert(self, model):

     
        
        counter  = 0
        email = re.search(r'^[\w\.\+\-]+\@[\w]+\.[a-z]{2,3}$', str( model.auth.email))

        if ( email ):
          obj = Parent(id=model.auth.email)
          obj.name = model.name
          obj.location = model.location
          obj.child_list = model.child_list
         
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
          obj.responsibles = model.responsibles
          
          obj.put()

          

          for child in obj.child_list:
            counter = counter+1
            # kindergartenObj = Kindergarten. (id=child.kindergarten_id )    
            kindergartenObj = ndb.Key(Kindergarten, child.kindergarten_id ).get()
            childObj = Child(id=child.child_id)
            childObj.name = child.name
            childObj.image = child.image
            childObj.birthday = child.birthday
            childObj.gender = child.gender
            childObj.active_date = child.active_date
            kindergartenObj.child_list.append(childObj)

            if ( counter == len(obj.child_list)):
              kindergartenObj.put()


        return model

    @Kindergarten.query_method(  query_fields=( 'userUrlID' 
                              ,'limit' ,'order' ,'pageToken') ,name='KindergartenList',path='KindergartenList')
    def KindergartenList(self,query):
        return query




    @Kindergarten.method(request_fields=(  'name' 
                              ,'location'
                              ,'parent_list'                         
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
                              ,'open_time'
                              ,'close_time'
                              ,'working_on_friday'
                              ,'working_on_saturday'
                              ,'working_on_sunday'
                             ) ,path="Kindergarten_insert", name="Kindergarten_insert")
    def Kindergarten_insert(self, model):

     
        
        counter  = 0
        email = re.search(r'^[\w\.\+\-]+\@[\w]+\.[a-z]{2,3}$', str( model.auth.email))

        if ( email ):
          obj = Kindergarten(id=model.auth.email)
          obj.name = model.name
          obj.location = model.location
          obj.parent_list = model.parent_list
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
          obj.open_time = model.open_time
          obj.close_time = model.close_time
          obj.working_on_friday = model.working_on_friday
          obj.working_on_saturday = model.working_on_saturday
          obj.working_on_sunday = model.working_on_sunday

          
          obj.put()

          for parent in obj.parent_list:
            counter = counter+1
            # kindergartenObj = Kindergarten. (id=child.kindergarten_id )    
            kindergartenObj = ndb.Key(Kindergarten, child.kindergarten_id ).get()

            parentObj = parent(id=parent.email)
           
            parentObj.responsibles = parent.responsibles
            parentObj.child_list = parent.child_list

            kindergartenObj.parent_list.append(parentObj)

            if ( counter == len(obj.parent_list)):
              kindergartenObj.put()


        return model

    @Kindergarten.query_method(  query_fields=( 'userUrlID' 
                              ,'limit' ,'order' ,'pageToken') ,name='KindergartenList',path='KindergartenList')
    def KindergartenList(self,query):
        return query





api = endpoints.api_server([ckid_server],restricted=False)


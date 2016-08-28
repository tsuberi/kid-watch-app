# -*- coding: utf-8 -*-
import webapp2
from classes import Image

from google.appengine.api import images
from google.appengine.api import users
from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext import blobstore
from google.appengine.ext.webapp import blobstore_handlers
from google.appengine.ext.webapp.util import run_wsgi_app
from operator import attrgetter
import datetime
import json
import urllib
import os


from twilio.rest  import TwilioRestClient
import  twilio
import six
# from six import u

class UserPhoto(db.Model):
    user = db.StringProperty()
    blob_key = blobstore.BlobReferenceProperty()
    item = db.StringProperty()
    image = db.StringProperty()
    CountryKey = db.StringProperty()
    Category = db.StringProperty()
    SubCategory = db.StringProperty()


class ViewPhotoHandler(blobstore_handlers.BlobstoreDownloadHandler):
    def get(self, photo_key):
        self.response.out.write(photo_key)
        if not blobstore.get(photo_key):
            self.error(404)
        else:
            self.send_blob(photo_key)


class PhotoUploadHandler(blobstore_handlers.BlobstoreUploadHandler):
    def post(self):
        try:
            upload = self.get_uploads()[0]
            user_photo = UserPhoto(blob_key=upload.key())
            # user_photo.item = self.request.get('item')
            # user_photo.Category = self.request.get('Category')
            #user_photo.SubCategory = self.request.get('SubCategory')
            db.put(user_photo)
            user_photo.image = '/api/view_photo/%s' % upload.key()
            db.put(user_photo)

            self.response.out.write(upload.key())
            #self.redirect('/api/PassKey1?key=%s' % upload.key())
        except:
            self.redirect('/upload_failure.html')


class oauth2callback(webapp.RequestHandler):
    def get(self):
        self.response.out.write('key')

    def post(self):
        self.response.out.write('key')




class uploadKey(webapp.RequestHandler):
    def get(self):
        upload_url = blobstore.create_upload_url('/api/upload_photo')
        # The method must be "POST" and enctype must be set to "multipart/form-data".
        self.response.out.write(upload_url)




class Test(webapp2.RequestHandler):
    def get(self):  
        self.response.write("count = ")




class SendSMSTest(webapp2.RequestHandler):
    def get(self):

        ACCOUNT_SID = "AC79986d6d1c28f88a376ad442f32ff303"
        AUTH_TOKEN = "a7049b0a7fcecc2605bdbd1d85e39123"

        client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN)
        rv = client.messages.create(
            body="Hello Monkey!",  # Message body, if any
            to="+972584633356",
            from_="+15005550006",
        )   

        self.response.out.write('Sms OK' + str(rv))




class SendSMS(webapp2.RequestHandler):
    def get(self, phone):
        # replace with your credentials from: https://www.twilio.com/user/account

        ACCOUNT_SID = "ACee3212de166539f38ec6533956597360"
        AUTH_TOKEN = "74f1e17261ece29f7b311f12af1b1888"

        client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN)
        rv = client.messages.create(
            #to="+972584633355", 
            to = phone,
            
            from_="+972526269220", 
            body="test from watch kid" +  "\n"+ "מיסרון ניסיון מ - watcjkid",  
        )   

        self.response.out.write('Sms OK' + str(rv))


class GetImage(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'image/jpg'
        # self.response.headers['Content-Type'] = 'text/plain'
        # self.response.headers['Cache-Control'] = 'public'

        imagelist = Image.query()

        for image_obj in imagelist:
            self.response.out.write(image_obj.image_pic)
            #return image_obj.image_pic
            break


application = webapp2.WSGIApplication([
                                          ('/api/uploadKey', uploadKey),
                                          ('/api/upload_photo', PhotoUploadHandler),                                        
                                          ('/api/view_photo/([^/]+)?', ViewPhotoHandler),                                        
                                          ('/api/Test', Test),
                                          ('/api/send_sms/([^/]+)?', SendSMS),
                                          ('/api/send_sms_test', SendSMSTest),
                                          ('/api/oauth2callback', oauth2callback),
                                          ('/api/GetImage', GetImage)
                                      ], debug=True)


def main():
    application.RUN()


if __name__ == '__main__':
    main()

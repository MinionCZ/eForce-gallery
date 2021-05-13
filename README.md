**eForce Gallery**

What is eForce gallery?
eForce gallery is web app serving as cloud storage for team photos. Photos can be uploaded/added to multiple galleries in web app or just uploaded to mass storage. Each photo is resized to lite version, so its size is reduced under 2MB. Galleries can be tagged by multiple tags and this tags can be used to search photos or galleries.

How eForce gallery works?
eForce gallery is divided into 5 pages:


Dashboard
In dashobard you can find all galleries from web app each one is represented by preview image and description
If you click on gallery, there will appear window with possibility to download full or lite version of gallery. Manage gallery in gallery manager or delete gallery
On the top is search bar with query, here you can select by which criterium do you want to sort galleries, or if you want them to be sorted ascending or descending
On top there can be also found search bar which searches by titles/tags/contributors/dates
Each gallery also has buttons with tags which are clickable and after click dashboard will only show galleries with same tag. If multiple tags are selected there is AND function between them so only galleries with both tags will show.




Add gallery
Here you can added new gallery to the system
Each new gallery must have specified title and event date
Gallery can be added with or without photos


Upload photos
Here can be uploaded photos to mass storage on server
Uploaded photos are not saved to any gallery
Photos can be uploaded via drag&drop or upload buttons


All photos
It this tab can be view all photos
Here after click can be photos seen in full size
Photos can be also selected by clicking on checkbox in small size or in preview size
Selected photos can be downloaded in full or lite version, added to gallery or deleted
After click on photo, photo is shown in preview mode
In preview mode photos can be downloaded in full/lite version, deleted or selected.



Gallery manager
Gallery manager can be accessed by 2 different ways:
First way is to click on gallery in dashboard and click on gallery manager
Second way is to click on gallery manager and then select your gallery in selector
After selecting gallery there will be 2 windows:
First window is window, where can be gallery modified
Second window is window with photos that are in this gallery
Each window also contains one toggle side bar with functions - such as deleting photos, downloading photos, and selecting them


How to upload photos?
Photos can be uploaded in multiple ways:

Upload photos to mass storage
Select on top menu button upload photos
Here will popup uplading window in which can be photos Drag&Dropped or just uploaded via button
Photos will be uploaded to mass storage

Upload photos to existing gallery:
Click on top menu on button gallery manager and select your gallery or find your gallery in dashboard and click on button manage gallery
In gallery manager click on side button which is situated on the right side of screen.
Here click on button upload photos and upload your photos to gallery
Create new gallery and upload photos to it
Click in top menu on button add gallery
Here will appear form to create new gallery in which you have to fill gallery name and event date
You can drag&drop or use button to uplad photos
After that you can submit newly created gallery


Parts of program
eForce gallery is programmed in NodeJS 14 and as database is used MongoDB. For resizing of photos is used programm GraphicsMagick.

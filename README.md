# FriendyFy

**Link to the website -> https://friendyfy20221127171333.azurewebsites.net/**

**ASP .NET Core 7.0 with ReactJS**

The website is a **social network** website just like facebook, where the main focus is on **meeting with people, by creating events**. Everything is based on **interests**. Upon registering every user chooses **his interests** and based on them, he can find **events and people with simillar ones**.

## **Features**

The websites allows its users to meet new people, by joining events with people, who have simillar interests.

#### **Guest**

Everyone who visits the site is a guest.
The home page for **guests** is the login/register page. They can **view profiles and events**, but **cannot interact with them**. They have a **search bar** in order to look for people/events.

#### **User**

Whenever a guest creates and logs into his account, he becomes a **User**.

Every user **must**:
- Upload a **profile and cover picture**
- Choose **at least 3 interests** upon registering
- Choose where he is **located**
- Fill in some additional data like **Gender and Birthday**

Users can:

- Create posts with or without:
  - Picture
  - Location
  - Tagged People
  - Post Message

- Create events with:
  - Name
  - Time, Date and Location
  - Up to 6 interests
  - Event Image
  - Short Event Description
 
- View Their Profile with Friends, Posts and Photos
- Have a Feed in their main page
- Find recommended people and events in their left navigation panel
- See people who they probably met in the right navigation panel
- Befriend other people, by going into their profile and sending them a friend request
- Accept/Reject friend requests from other people
- Receive notifications, when someone liked/commented on his post, joined an event organizes by him, accepted his friend request and many more cases
- Chat with his friends
- Delete his posts
- Edit his profile information, interests and picture
- Choose between Light and Dark theme
- Search for users and event in the Search Page



## :hammer_and_wrench: Built With
### Back End (.NET)
- ASP.NET Core 7.0
- Entity Framework (EF) Core 7.0
- Razor View Engine
- ASP.NET Identity System
- Web API
- SignalR
- Auto Mapper
- SendGrid

### Frond End (React)
- ReactJS
- Context API
- Hooks
- Many React packages like:
  - react-router
  - fortawesome
  - microsoft/signalr
  - react-google-maps
  - react-datetime
  - react-transition-group
  - and many more

### Other Features
- JWT authentication system
- UX & UI
- Light and Dark Mode
- Responsive Design
- Validation and Error Handling
- Azure Blob Storage for image storage
- Google Maps API

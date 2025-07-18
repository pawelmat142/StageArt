# StageArt: A Platform for Artist Booking Management

## Still working on documentation and bugfixing...

## **Overview**

StageArt is a prototype web application designed to streamline the process of connecting event 
organizers with artists. The platform simplifies the discovery, booking, and management of artist
engagements, enabling seamless collaboration between users. With its intuitive interface, StageArt helps
users focus on creating memorable events while minimizing administrative tasks.

### Project prototype runs [here](http://130.162.34.50:8003/).

### Target Users
- **Artists**: Showcase their profiles and attract potential collaborators.
- **Artist Managers**: Manage artist profiles and handle booking requests.
- **Event Promoters**: Find, book, and coordinate with artists for their events.

<br>

## Tech Stack

#### Angular - more details in [./frontend](./frontend/README.md)

#### NestJS - more details in [./backend](./backend/README.md)

#### MongoDB + firebase storage for uploaded images
<br>


## **Key Features**

### **For Artists**
- **Artist Portfolio**: Showcase bios, photos, and past performances to attract event promoters.

### **For Artist Managers**
- **Artist Profile Management**: Update and maintain artist portfolios to keep them current.
- **Booking Requests**: Handle incoming booking inquiries, including event details and schedules.

### **For Event Promoters**
- **Search and Filter**: Discover artists based on style, availability, and other criteria.
- **Booking Management**: Submit and manage artist booking requests seamlessly.
- **Event Scheduling**: Showcase and plan events featuring selected artists.


## Start locally

- create project directory, get inside and run:
```
git clone https://github.com/pawelmat142/book-agency.git ./
```
- go to /backend and run:

```
nest start
```
or with hot reload:
```
npm run start:dev 
```
- go to ../frontend and run:
```
ng serve
```

<br>


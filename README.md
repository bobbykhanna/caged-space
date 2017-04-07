# Caged-Space

### Prepared Music Field System

### Introduction


Caged Space is a system that will created a prepared music field that will allow the audience to move through the space using their smart phones to engage both with live performers and digitally delivered augmented pieces of the composition. Each member of the audience will have a unique listening experience depending upon their position and movement during the performance.

![image](http://cf.ydcdn.net/1.0.1.27/images/main/acoustics.jpg)
<br />
The spatial setting informs the prepared music field both through the diffuse spacing of the musicians and by the configuration of performances in multiple settings using topological instruction. The movement through the space affords a new method of spatial engagement for the audience.

The historical constellation of music engages the prepared music field by developing the range of instrumental, found, and manufactured sounds as media for the piece. This project fits within a tradition of innovation and inclusion that stretches back at least a century.

The technological matrix provides a new medium of engagement with the prepared music field using smart phone technology to provide precise location information and to supplement or alter the live acoustics. This project uses technology to actively prepare and interact with the space.

Initial venue for this system will be one of Charlotte area’s museums.
**Project Overview:** http://ejsauda.wixsite.com/prepared-music-field

### Project Sponsors
College of Arts and Architecture at UNCC:  http://coaa.uncc.edu
College of Computing and Informatics at UNCC: http://sis.uncc.edu
Eric Sauda, Director of Digital Arts Center at UNCC:  http://descomp.uncc.edu
Scott Christian (Composer):  https://www.facebook.com/pg/Fresh-Ink-312489822105147/about/
Levvel (System Architecture and Software Development): http://www.levvel.io

### System Design

![image](https://github.com/iyeremuk/caged-space/blob/development/Assets/Picture1.png)

### System Components

**Audience App** – allows audience members to connect to Caged Space’s local Wi-Fi network to listen to various music streams based on their relative position. Audience location will be determined via Estimote Bluetooth beacons.
<br />
**Streaming App** – this application will be run on a central computer, and will tie into a professional concert streaming software to broadcast various streams via local Wi-Fi network.
<br />
**Admin App** – allows system administrator to configure venue’s space, add and configure location beacons, and tie-in music streams with musicians’ location.

### Technology, Software, and Hardware
#### Front End<br />
*	Ionic Framework 2: http://ionicframework.com<br />
*	Angular 2: https://angular.io<br />
#### Back End<br />
*	AWS Lambdas: https://aws.amazon.com/lambda<br />
*	Serverless Framework: https://serverless.com<br />
#### Hosting<br />
*	Firebase Web Hosting: https://firebase.google.com/docs/hosting<br />
#### Data Persistence<br />
*	Firebase Real-Time Database: https://firebase.google.com/docs/database/<br />
#### Security<br />
*	JSON Web Tokens: https://jwt.io<br />
#### Source Control, Issues Tracking, and Communication Channel<br />
*	GitHub: https://github.com<br />
*	Trello: https://trello.com<br />
*	Slack: https://slack.com/is<br />
#### Software Development Process<br />
*	Agile Methodology: https://en.wikipedia.org/wiki/Agile_software_development<br />
*	Open Source: https://en.wikipedia.org/wiki/Open-source_software <br />
#### Music Software<br />
*	Abletone Live: https://www.ableton.com/en/live<br />
#### Hardware<br />
*	24 Estimote Bluetooth beacons: http://estimote.com/#jump-to-products<br />
*	6 Nady SCM 960 Studio condenser microphones and cabling.<br />
*	1 Ubiquiti UniFi AP-AC-PRO Managed Wireless Access Point: https://www.ubnt.com/unifi/unifi-ap-ac-pro<br />
*	1 Firestudio 2626 mixer: http://www.presonus.com/products/Firestudio<br />
*	2 BehringereADA8000 audio interfaces: http://www.music-group.com/Categories/Behringer/Computer-Audio/Audio-Interfaces/ADA8000/p/P0187<br />

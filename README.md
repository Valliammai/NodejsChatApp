# NodejsChatApp
This is a basic real time chat application for multiple people created using node.js with express, socket.io and Sqlite database.
The person can enter the chat room by entering an username.
When the user types in a message and click 'Post', it posts the message into the chat window along with the person username and time.
Any number of people can use this chat application and chat with each other.
When a new user logs in, if they give the same username which is already existing, it throws a validation message so that the person has to enter another username.
After a second user logs in, they should be able to see all the old messages.
When a user exits and re-enters the chat window, he can login with the same username and he should be able to see all the old messages.
When there are multiple windows opened, any new message from any window will dynamically displays in all the windows. 
The chat window is scrollable to see all the messages when there are more.

## .env Configuration
```
# Google as Identity Provider
REACT_APP_OAUTH2_GOOGLE_CLIENT_ID=683698613471-vtek3ckgohm4f1vr4rbs1ga67elh0he0.apps.googleusercontent.com
REACT_APP_OAUTH2_GOOGLE_REDIRECT_URI=/callback/oauth2/google
REACT_APP_OAUTH2_GOOGLE_ENDPOINT_AUTH=https://accounts.google.com/o/oauth2/auth
REACT_APP_OAUTH2_GOOGLE_SCOPE=profile
```

## Release
```
tsc
npm pack
npm publish
```
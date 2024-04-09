import 'reflect-metadata';
import { injectable } from 'inversify';
import { RematchDispatch } from '@rematch/core';
import { AbstractCallbackHandler, getUrlQueryParamRaw } from '@libreforge/libreforge-framework';

type TokenIssueResponse = {
  sessionId: string,
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

const TOKEN_ID = "token";

@injectable()
export class OAuth2GoogleCallbackHandler extends AbstractCallbackHandler {

  private getAccessToken = async (tokenEndpoint: string, code: string, clientId: string, redirectUri: string) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        redirectUri,
        clientId
      })      
    };

    return fetch(tokenEndpoint, requestOptions);
  }

  getRoute() {
    return "/oauth2/google"
  };

  async execute(
    appState: any,
    dispatch: RematchDispatch<any>,
    snackbar: any,
    router: any
  ) {
    console.warn('/oauth2/google received. Handling redirect from Google');

    if (!!appState.sharedState.token) {
      console.warn('Token is not null, skipping...');
      return;
    } else {

      const tokenEndpoint = `${process.env.REACT_APP_BASE_URL}/api/integration/security/oauth2/token`;
      const clientId = process.env.REACT_APP_OAUTH2_GOOGLE_CLIENT_ID || "";
      const redirectUri = `${window.location.origin}${window.location.pathname}`;
      const code = getUrlQueryParamRaw("code") || "";
  
      try {
        const response = await this.getAccessToken(tokenEndpoint, code, clientId, redirectUri);
        const tokenObject = await response.json() as TokenIssueResponse;

        if (!!tokenObject.sessionId) {
          localStorage.setItem("oauth2_session_id", tokenObject.sessionId);
        }
        await dispatch.app.changeSharedState({ name: TOKEN_ID, value: tokenObject.accessToken });

      } catch (error) {
        console.error(error);
        return;
      }

      /* Redirect to restricted page */
      const restrictedPage = localStorage.getItem("oauth2_restricted_page");
      console.warn(`Restricted Page in localStorage - ${restrictedPage}`);

      if (!!restrictedPage) {
        localStorage.removeItem("oauth2_restricted_page");
        router(restrictedPage);
      } else {
        /* Else go to the home page */
        router("/");
      }
    }
  };
}

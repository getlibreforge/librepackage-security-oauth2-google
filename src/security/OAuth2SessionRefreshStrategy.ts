import 'reflect-metadata';
import { injectable } from 'inversify';
import { RematchDispatch } from '@rematch/core';
import { AbstractSessionRefreshStrategy } from '@libreforge/libreforge-framework';

type TokenRefreshResponse = {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

const TOKEN_ID = "token";

@injectable()
export class OAuth2SessionRefreshStrategy extends AbstractSessionRefreshStrategy {

  private getRefreshedAccessToken = async (refreshEndpoint: string, clientId: string, sessionId: string) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        clientId
      })      
    };

    return fetch(refreshEndpoint, requestOptions);
  }

  async refresh(dispatch: RematchDispatch<any>): Promise<boolean> {

    const sessionId = localStorage.getItem("oauth2_session_id");
    if (!sessionId) {
      console.warn('OAuth2SessionRefreshStrategy > no sessionId found, skipping...');
      return false;
    }

    const refreshEndpoint = `${process.env.REACT_APP_BASE_URL}/api/integration/security/oauth2/refresh`;
    const clientId = process.env.REACT_APP_OAUTH2_GOOGLE_CLIENT_ID || "";

    try {
      const response = await this.getRefreshedAccessToken(refreshEndpoint, clientId, sessionId);
      const tokenObject = await response.json() as TokenRefreshResponse;
      await dispatch.app.changeSharedState({ name: TOKEN_ID, value: tokenObject.accessToken });
      
    } catch (error) {
      console.error(`OAuth2SessionRefreshStrategy > error received - ${error}`);
      return false;
    }

    return true;
  }
}

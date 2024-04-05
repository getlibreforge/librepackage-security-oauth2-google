import 'reflect-metadata';
import { injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { AbstractAction, ActionExecutionContext, getUrlQueryParam } from '@libreforge/libreforge-framework';

@injectable()
export class OAuth2GoogleRedirectAction extends AbstractAction {

  name = 'OAuth2GoogleRedirect';

  getName() {
    return this.name;
  }

  async execute(context: ActionExecutionContext): Promise<{ next: boolean, result: any }> {

    console.warn('OAuth2GoogleRedirectAction called'); 

    /* Save original redirect_uri to LocalStorage */
    const restrictedPage = getUrlQueryParam('redirect_uri');
    if (!!restrictedPage) {
      localStorage.setItem("oauth2_restricted_page", restrictedPage);
    }

    const authEndpoint = process.env.REACT_APP_OAUTH2_GOOGLE_ENDPOINT_AUTH || "";
    const clientId = process.env.REACT_APP_OAUTH2_GOOGLE_CLIENT_ID || "";
    const redirectUri = `${window.location.origin}${process.env.REACT_APP_OAUTH2_GOOGLE_REDIRECT_URI || ""}`;
    const scope = process.env.REACT_APP_OAUTH2_GOOGLE_SCOPE || "";
    const state = uuidv4();

    const targetUrl = `${authEndpoint}?client_id=${clientId}&state=${state}&scope=${scope}&redirect_uri=${redirectUri}&response_type=code&access_type=offline`;
    window.location.href = targetUrl;

    return { next: true, result: undefined };
  }
}

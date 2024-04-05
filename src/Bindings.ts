import { AbstractAction, AbstractCallbackHandler, AbstractSessionRefreshStrategy, SYMBOL_ACTION_PROVIDER, SYMBOL_CALLBACK_PROVIDER, SYMBOL_REFRESH_STRATEGY } from '@libreforge/libreforge-framework';
import { Container } from 'inversify';
import { OAuth2GoogleRedirectAction } from './actions/OAuth2GoogleRedirectAction';
import { OAuth2GoogleCallbackHandler } from './callback/OAuth2GoogleCallbackHandler';
import { OAuth2SessionRefreshStrategy } from './security/OAuth2SessionRefreshStrategy';

export function bindProviders(container: Container) {
  container.bind<AbstractAction>(SYMBOL_ACTION_PROVIDER).to(OAuth2GoogleRedirectAction);
  container.bind<AbstractCallbackHandler>(SYMBOL_CALLBACK_PROVIDER).to(OAuth2GoogleCallbackHandler);
  container.bind<AbstractSessionRefreshStrategy>(SYMBOL_REFRESH_STRATEGY).to(OAuth2SessionRefreshStrategy);
}

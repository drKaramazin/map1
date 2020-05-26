import { environment } from '../environments/environment';
import { YandexMapService } from './services/yandex-map.service';

export function initApp(): () => Promise<void> {

  function initYandexApi() {
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${environment.yandexApiKey}&load=package.full&lang=ru_RU&mode=debug`;
      script.type = 'text/javascript';
      script.async = true;
      document.head.appendChild(script);
  }

  return () => {
    return new Promise((resolve) => {
      initYandexApi();
      resolve();
    });
  };
}

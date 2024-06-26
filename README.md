![SHOW logo](/assets/show-logo.webp)

Atenção: Se deseja utilizar o SHOW em projetos com Vue 2, utilize a versão `0.3.0` ou inferior.

## Instalando

- O SHOW pode ser instalado com o npm:
```bash
$ npm i @sysvale/show;
```

## Usando


```bash
$ npm i @sysvale/show;
```

- Para usar o SHOW, importe a biblioteca no seu entry point, provavelmente vai ser seu main.js ou app.js:
```js
import SHOW from '@sysvale/show';
```

- Para usar o SHOW, importe a biblioteca no seu entry point, provavelmente vai ser seu main.js ou app.js:

- E instale o SHOW:
```js
Vue.use(SHOW);
```

- Agora para utilizar os componentes, basta usá-los no seu template. Como exemplo, para usar a 
[RequestProvider]():
```html
<show-request-provider
  v-slot="{ loading, failed, errorMessage, data: posts }"
  :service="getPosts"
>
  <div>
    <div v-if="loading">Carregando...</div>
    <div v-else-if="failed">{{ errorMessage }}</div>
    <div v-else>
      <div v-for="post in posts">
        <a :href="post.link">{{ post.title }}</a>
      </div>
    </div>
  </div>
</show-request-provider>
```

**Para saber mais sobre a utilização do SHOW, consulte a [Wiki](https://github.com/Sysvale/sys-hand-on-wheel/wiki)**.

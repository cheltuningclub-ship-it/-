# Интеллект Медиа — сайт

Новый корпоративный сайт агентства рекламы на LED-экранах в Оренбурге: [intellect-media.ru](https://intellect-media.ru/).

## Страницы

1. `index.html` — главная  
2. `uslugi.html` — услуги  
3. `ekrany.html` — сеть экранов  
4. `o-kompanii.html` — о компании  
5. `kontakty.html` — контакты  
6. `rekvizity.html` — реквизиты  
7. `politika-konfidencialnosti.html` — политика ПДн (152-ФЗ)  
8. `soglasie-pdn.html` — согласие на обработку ПДн  
9. `cookie.html` — политика cookie  

## SEO и индексация

- `robots.txt` и `sitemap.xml`
- уникальные `title` / `description`, canonical, Open Graph
- JSON-LD (`LocalBusiness`, услуги, контакты)
- семантическая вёрстка, `lang="ru"`, alt у изображений

После публикации добавьте сайт в [Яндекс.Вебмастер](https://webmaster.yandex.ru/) и [Google Search Console](https://search.google.com/search-console), отправьте `sitemap.xml`.

## Юридические требования (РФ)

- политика обработки персональных данных (152-ФЗ)
- отдельное согласие на обработку ПДн в формах
- баннер и политика cookie
- страница реквизитов / сведений об операторе
- дисклеймер о рекламном характере информации и об отсутствии публичной оферты

В блоке «Юридические реквизиты» укажите актуальные ОГРН/ИНН вашей организации — они подставляются в договоры и на страницу `rekvizity.html`.

## Локальный просмотр

```bash
python3 -m http.server 8080
```

Откройте http://localhost:8080/

## Деплой

Статический сайт: загрузите содержимое репозитория в корень хостинга домена `intellect-media.ru` (Nginx, Apache, Timeweb, Beget, GitHub Pages и т.п.).

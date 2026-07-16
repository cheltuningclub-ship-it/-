# Интеллект Медиа — корпоративный сайт

Современный многостраничный сайт для рекламного агентства [Интеллект Медиа](https://intellect-media.ru/) — размещение рекламы на LED-экранах в Оренбурге.

## Страницы

| Страница | URL | Описание |
|----------|-----|----------|
| Главная | `index.html` | Лендинг с услугами и преимуществами |
| О компании | `about.html` | Информация о компании |
| Услуги | `services.html` | LED-реклама, аналитика, креатив |
| Адреса экранов | `locations.html` | Локации размещения |
| Контакты | `contacts.html` | Контакты и форма заявки |
| Политика ПДн | `privacy-policy.html` | 152-ФЗ |
| Согласие на ПДн | `consent.html` | Отдельный документ согласия |
| Политика cookies | `cookie-policy.html` | Управление cookies |
| Пользовательское соглашение | `user-agreement.html` | Условия использования сайта |

## Соответствие законодательству РФ (2026)

- Политика обработки персональных данных (152-ФЗ)
- Отдельное согласие на обработку ПДн (не в составе оферты)
- Раздельные чекбоксы: ПДн (обязательный) и рекламная рассылка (необязательный, 266-ФЗ)
- Cookie-баннер с кнопками «Принять все» / «Отклонить все» / «Настроить»
- Юридические реквизиты в подвале каждой страницы
- Логирование согласий в localStorage (для демо; на продакшене — серверная БД)
- Яндекс.Метрика вместо Google Analytics (данные в РФ)
- Без трансграничной передачи данных

## Перед публикацией

1. **Укажите реальные реквизиты** в `js/config.js`:
   - ИНН, ОГРН, КПП
   - Полное юридическое наименование
   - ФИО руководителя (при необходимости)

2. **Подайте уведомление в Роскомнадзор** о начале обработки ПДн: [rkn.gov.ru](https://rkn.gov.ru/personal-data/register/)

3. **Подключите Яндекс.Метрику** (опционально):
   ```js
   // js/config.js
   yandexMetrika: { enabled: true, id: 'ВАШ_ID' }
   ```

4. **Настройте серверную обработку форм** — сейчас форма демонстрирует UX; для продакшена подключите backend или сервис форм с хранением в РФ.

5. **Зарегистрируйте сайт** в [Яндекс.Вебмастер](https://webmaster.yandex.ru/) и [Google Search Console](https://search.google.com/search-console) для индексации.

## SEO

- Семантическая HTML-разметка
- Meta title, description, canonical на каждой странице
- Open Graph теги
- Schema.org JSON-LD (LocalBusiness)
- `sitemap.xml` и `robots.txt`
- Адаптивный дизайн (mobile-first)

## Локальный запуск

```bash
# Python
python3 -m http.server 8080

# или Node.js
npx serve .
```

Откройте http://localhost:8080

## Структура

```
├── index.html
├── about.html
├── services.html
├── locations.html
├── contacts.html
├── privacy-policy.html
├── consent.html
├── cookie-policy.html
├── user-agreement.html
├── robots.txt
├── sitemap.xml
├── css/styles.css
├── js/
│   ├── config.js
│   ├── main.js
│   ├── form.js
│   └── cookie-consent.js
└── images/favicon.svg
```

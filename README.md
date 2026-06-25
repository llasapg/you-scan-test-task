# Dashboard

A widget-based dashboard. Add charts and text widgets, edit them, delete them.

The API now uses an in-memory database

## Running Locally

The easy way:
```bash
docker-compose up
```
Then open http://localhost:3000

The manual way:
```bash
# API
cd api
dotnet run

# Frontend
cd frontend
npm install
npm run dev
```

## Deploying is done to Cloudflare Pages and railway

its done by CI/CD pipeline configured there

## GraphQL API

Available at `/graphql`. Check `/graphql` in your browser for GraphQL Playground.

**Queries:**
- `widgets` - get all widgets
- `widget(id: UUID!)` - get one widget

**Mutations:**
- `createWidget(input: CreateWidgetInput!)` - add a widget
- `updateWidget(input: UpdateWidgetInput!)` - update widget data
- `deleteWidget(input: DeleteWidgetInput!)` - remove a widget

## Notes

- Widgets and dashboards are stored in-memory while the API process is running
- Restarting the API resets the data
- Position reordering happens automatically on delete
- Text widgets can store up to 5000 characters
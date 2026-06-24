# Dashboard

A widget-based dashboard. Add charts and text widgets, edit them, delete them. That's it.

## Running Locally

The easy way:
```bash
docker-compose up
```
Then open http://localhost:3000

The manual way:
```bash
# Start PostgreSQL (however you prefer)

# API
cd api
dotnet run

# Frontend
cd frontend
npm install
npm run dev
```

## Deploying to Kubernetes

its done by CI/CD pipeline, but you can also do it manually:

```bash
kubectl apply -f k8s
```

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

- Widgets are stored in PostgreSQL
- Position reordering happens automatically on delete
- Text widgets can store up to 5000 characters
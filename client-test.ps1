# Categories for random selection
$categories = @("Work", "Personal", "Shopping", "Learning", "Health", "Home")
# Base URL matching the client.http configuration
$baseUrl = "http://localhost:3000"

while ($true) {
    # Generate random data
    $randomId = Get-Random -Minimum 1 -Maximum 1000
    $randomCategory = $categories | Get-Random
    $randomDays = Get-Random -Minimum 1 -Maximum 30
    $expirationDate = (Get-Date).AddDays($randomDays).ToString("yyyy-MM-ddTHH:mm:ss.000Z")
    
    # Create new TODO
    $newTodo = @{
        description = "Random Task #$randomId"
        category = $randomCategory
        expirationDate = $expirationDate
    } | ConvertTo-Json

    Write-Host "`n[$(Get-Date)] Creating new TODO..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri "$baseUrl/todos" -Method Post -Body $newTodo -ContentType "application/json"
    $createdId = $response.id
    Write-Host "Created TODO with ID: $createdId" -ForegroundColor Green

    # Get the created TODO
    Write-Host "`n[$(Get-Date)] Getting created TODO..." -ForegroundColor Cyan
    $todo = Invoke-RestMethod -Uri "$baseUrl/todos/$createdId" -Method Get
    Write-Host "Retrieved TODO:" -ForegroundColor Green
    $todo | ConvertTo-Json

    # Get all TODOs
    Write-Host "`n[$(Get-Date)] Getting all TODOs..." -ForegroundColor Cyan
    $todos = Invoke-RestMethod -Uri "$baseUrl/todos" -Method Get
    Write-Host "Total TODOs: $($todos.Count)" -ForegroundColor Green

    # Random delay between 2-10 seconds
    $delay = Get-Random -Minimum 2 -Maximum 11
    Write-Host "`nWaiting $delay seconds...`n" -ForegroundColor Yellow
    Start-Sleep -Seconds $delay
}
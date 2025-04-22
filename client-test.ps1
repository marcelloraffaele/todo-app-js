# Categories for random selection
$categories = @("Work", "Personal", "Shopping", "Learning", "Health", "Home")
# Base URL matching the client.http configuration
$baseUrl = "http://localhost:3000"
# Possible User IDs
$userIds = @("user-alpha", "user-beta", "user-gamma")

while ($true) {
    # Select a random user ID
    $currentUserId = $userIds | Get-Random
    Write-Host "`n[$(Get-Date)] Testing with USER_ID: ${currentUserId}" -ForegroundColor Magenta

    # Generate random data
    $randomId = Get-Random -Minimum 1 -Maximum 1000
    $randomCategory = $categories | Get-Random
    $randomDays = Get-Random -Minimum 1 -Maximum 30
    $expirationDate = (Get-Date).AddDays($randomDays).ToString("yyyy-MM-ddTHH:mm:ss.000Z")
    
    # Create new TODO
    $newTodo = @{
        description = "Random Task #${randomId} for ${currentUserId}"
        category = $randomCategory
        expirationDate = $expirationDate
    } | ConvertTo-Json

    # Define headers
    $headers = @{
        "USER_ID" = $currentUserId
    }

    Write-Host "`n[$(Get-Date)] Creating new TODO for ${currentUserId}..." -ForegroundColor Cyan
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/todos" -Method Post -Body $newTodo -ContentType "application/json" -Headers $headers
        $createdId = $response.id
        Write-Host "Created TODO with ID: ${createdId} for ${currentUserId}" -ForegroundColor Green

        # Get the created TODO
        Write-Host "`n[$(Get-Date)] Getting created TODO (ID: ${createdId}) for ${currentUserId}..." -ForegroundColor Cyan
        $todo = Invoke-RestMethod -Uri "$baseUrl/todos/$createdId" -Method Get -Headers $headers
        Write-Host "Retrieved TODO for ${currentUserId}:" -ForegroundColor Green
        $todo | ConvertTo-Json

        # Get all TODOs for the current user
        Write-Host "`n[$(Get-Date)] Getting all TODOs for ${currentUserId}..." -ForegroundColor Cyan
        $todos = Invoke-RestMethod -Uri "$baseUrl/todos" -Method Get -Headers $headers
        Write-Host "Total TODOs for ${currentUserId}: $($todos.Count)" -ForegroundColor Green

    } catch {
        Write-Host "Error during API call for ${currentUserId}: $($_.Exception.Message)" -ForegroundColor Red
        # Optionally inspect the response for more details
        if ($_.Exception.Response) {
            $errorResponse = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorResponse)
            $reader.BaseStream.Position = 0
            $errorBody = $reader.ReadToEnd();
            Write-Host "Error Body: $errorBody" -ForegroundColor Red
            $reader.Close() # Close the stream reader
        }
    } # End catch

    # Random delay between 2-10 seconds
    $delay = Get-Random -Minimum 2 -Maximum 11
    Write-Host "`nWaiting $delay seconds...`n" -ForegroundColor Yellow
    Start-Sleep -Seconds $delay
} # End while
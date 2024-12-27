# Insert Only Unique Record

# Overview
This is Google Apps Script to insert only unique records into BigQuery. This use case is very useful when working with digital marketing campaign.

The script inserts only unique `date`+`email`+`utm_source`+`utm_medium`+`utm_campaign`.

# BigQuery configuration
<div align="center"><img src="https://github.com/user-attachments/assets/ba9a0bd1-0b74-42ac-9aeb-2520a1c6ecd4" /></div>
<div align="center">Table structure</div>

# Apps Script configuration
- Store GCP Project ID and BigQuery tablename into Script Properties, **Apps Script -> Project Settings -> Script Properties**.
    ```
    {
      projectId: <GCP Project ID>,
      table: <BigQuery tablename>
    }
    ```
- Deploy the project as webapp.
    ```
    Execute as: Me
    Who has access: Anyone
    ```
- Use the generated webapp url to call `POST`.

# Apps Script dependencies
- BigQuery service v2.

# Usage
`POST` /webapp url

Payload
```
{
 "email": "john.smith@email.com",
 "utm_source": "google",
 "utm_medium": "cpc",
 "utm_campaign": "brand"
}
```

# See also
- [insert-unique-record](https://github.com/sangnandar/insert-unique-record) same use case but using Cloud Functions instead of Apps Script.

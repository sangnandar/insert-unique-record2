function doPost(e)
{
  const body = JSON.parse(e.postData.contents);

  const query = `
    insert into ${table} (
      ts,
      date,
      email,
      utm_source,
      utm_medium,
      utm_campaign,
      hashed
    )
    with x as (
    select
      timestamp(@ts) as ts,
      date(@ts) as date,
      @email as email,
      @utm_source as utm_source,
      @utm_medium as utm_medium,
      @utm_campaign as utm_campaign,
      sha256(concat(
        cast(date(@ts) as string), 
        cast(@email as string), 
        cast(@utm_source as string), 
        cast(@utm_medium as string), 
        cast(@utm_campaign as string))
      ) as hashed
    )
    select
      ts,
      date,
      email,
      utm_source,
      utm_medium,
      utm_campaign,
      hashed
    from x 
    where
      not exists (
        select 1 from ${table} where hashed = x.hashed
      )
  `;

  const { email, utm_source, utm_medium, utm_campaign } = body;
  const request = {
    useLegacySql: false,
    parameterMode: 'NAMED',
    query: query,
    queryParameters: [
      {
        name: 'ts',
        parameterType: { type: 'TIMESTAMP' },
        parameterValue: { value: new Date().toISOString() }
      },
      {
        name: 'email',
        parameterType: { type: 'STRING' },
        parameterValue: { value: email || '' }
      },
      {
        name: 'utm_source',
        parameterType: { type: 'STRING' },
        parameterValue: { value: utm_source || '' }
      },
      {
        name: 'utm_medium',
        parameterType: { type: 'STRING' },
        parameterValue: { value: utm_medium || '' }
      },
      {
        name: 'utm_campaign',
        parameterType: { type: 'STRING' },
        parameterValue: { value: utm_campaign || '' }
      }
    ]
  };

  try {
    BigQuery.Jobs.query(request, projectId);
    return ContentService.createTextOutput(JSON.stringify({ status: 200, message: 'Success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 500, message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }

}

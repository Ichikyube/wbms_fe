syncronize master data product with semai
kita asumsikan user tidak akan mengubah-ubah date pada sistem komputernya





 **Using Cache-Control Headers**:

   If you're serving the configuration through a web server, you can set Cache-Control headers to specify the time duration for which the configuration should be considered valid by the client's cache.

The `Cache-Control` headers method is a way to control how caching is handled by the client's browser or other caching intermediaries (like proxy servers). It's typically used when serving resources through a web server.

Here's an explanation of how it works:

1. **Cache-Control Header**:

   The `Cache-Control` header is an HTTP header that defines caching policies. It provides directives to specify how a response should be cached. One of the directives is `max-age`.

   When a client (like a browser) receives a response with `Cache-Control` headers, it will store the response in its cache. If the client requests the same resource again within the specified `max-age` time, it will use the cached version instead of making a new request to the server.

   This can help improve performance by reducing the number of requests made to the server for resources that are not expected to change frequently.
   Keep in mind that while `Cache-Control` headers can improve performance, they should be used judiciously. It's important to consider factors like the nature of the resource, how frequently it's expected to change, and whether caching it is appropriate for your specific use case.
2. **`max-age` Directive**:

   The `max-age` directive specifies the maximum amount of time in seconds that a resource is considered fresh or valid. If the resource is requested again within this time period, the client's browser will use the cached version instead of making a new request to the server.

   For example, setting `max-age=86400` means that the resource is considered valid for 24 hours.


Buat Notifikasi + add message
Notifikasi hanya dapat dibaca oleh yang terdaftar dalam array target. notification.target.include(userinfo.id)?

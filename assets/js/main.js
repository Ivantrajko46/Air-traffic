 $(function() {

     function getLocation() {
         if (navigator.geolocation) {
             navigator.geolocation.getCurrentPosition(position, errorShow);
         } else {
             console.error("Vas browser ne podrzava geolocation");
         }
     }

     function position(position) {
         // console.log(position);
         aircraftList(position.coords.latitude, position.coords.longitude);
         //refreshe every 1 minute
         let refresh = setInterval(myRefresh, 60 * 1000);

         function myRefresh() {
             aircraftList(position.coords.latitude, position.coords.longitude);
         }
     }

     function errorShow(error) {
         // console.log(error);
         switch (error.code) {
             case error.PERMISSION_DENIED:
                 $('p#error').html("User denied the request for Geolocation. Refresh the page and try again.");
                 break;
             case error.POSITION_UNAVAILABLE:
                 $('p#error').html("Location information is unavailable.");
                 break;
             case error.TIMEOUT:
                 $('p#error').html("The request to get user location timed out.");
                 break;
             case error.UNKNOWN_ERROR:
                 $('p#error').html("An unknown error occurred.")
                 break;
         }
     }

    function aircraftList(lat, lng) {

         $.ajax({
             url: 'https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json?lat=' + lat + '&lng=' + lng + '&fDstL=0&fDstU=100',
             type: 'GET',
             data: {},
             dataType: 'jsonp',

         }).done(function(data) {
             // console.log(data);
             $('.content').html(''); // empty all content from lists after refresh
             let airData = data.acList;

             // Sorting list by altitude
             airData.sort(function(a, b) {
                 return b.Alt - a.Alt;
             });
             // content of aircraft lists
             airData.forEach(function(item, index) {
                 // direction of plane icon(east, west)
                 let direction = item.Trak;
                 let planeDirection = direction > 180 ? '<img src="./assets/img/west.png" alt="west">' : '<img src="./assets/img/east.png" alt="east">';

                 $('.content').append(`
                  <section class="myCard animated fadeIn">
                      <div id="plane" class="text-center">${planeDirection}</div>
                      <p id="altitude">Flight Id : ${item.Id}</p>
                      <p id="flightNo">Altitude : ${(item.Alt/3280).toFixed(2)} km</p>
                       
                    <i class="fas fa-plus" data-toggle="collapse" href="#listCollapse${index}" 
                    role="button" aria-expanded="false" aria-controls="listCollapse">
                    </i>
                      <div class="collapse" id="listCollapse${index}">
                        <div class="card card-body">
                          <div class="row">
                            <div class="col-xl-8 text-left">
                                <p><b>From:</b> ${item.From} <br><b>To:</b> ${item.To}</p>
                                <p><b>Arplane:</b> ${item.Man} <b>Model:</b> ${item.Mdl}</p>
                            </div>
                            <div class="col-xl-4>
                                <p class="text-left" id="logo"><img width="80px"
                                 src="https://logo.clearbit.com/${(item.Op).toLowerCase().replace(/\s/g,'')}.com" 
                                 alt="${(item.Op)}" onerror="src='https://upload.wikimedia.org/wikipedia/commons/c/ce/Example_image.png'"></p>
                                 <br><p>${item.Op}</p>
                            </div>
                          </div>
                        </div>
                      </div>                       
                  </section> `)

             });

         });

     }

     getLocation();
 });
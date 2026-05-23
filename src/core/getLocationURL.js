/**
 * Es una funcion asincrona que devuelve la localización 
 * exacta del usuario en una `url` de `google maps`.
 * 
 * Tambien puede devolver `null` si no es posible obtenerla.
 * @returns {Promise<string | null>}
 */
export default async function getLocationURL() {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const url = "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + latitude + "," + longitude + "&travelmode=driving";
            resolve(url);
        }, () => {
            resolve(null);
        }, 
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    });
} 
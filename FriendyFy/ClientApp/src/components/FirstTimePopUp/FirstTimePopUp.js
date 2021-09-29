import React from 'react';
import './FirstTimePopUp..css';

function initialize() {
    var mapProp = {
        center:new google.maps.LatLng(51.508742,-0.120850),
    zoom:5,
    mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    var map=new google.maps.Map(document.getElementById("googleMap"), mapProp);
    document.getElementById('lat').value= 51.508742
    document.getElementById('lng').value= -0.120850

    google.maps.event.addListener(marker,'drag',function(event) {
        document.getElementById('lat').value = event.latLng.lat();
    document.getElementById('lng').value = event.latLng.lng();
    });

    google.maps.event.addListener(marker,'dragend',function(event) {
        document.getElementById('lat').value = event.latLng.lat();
    document.getElementById('lng').value = event.latLng.lng();
        });
    }

const RegisterPopUp = (props) => (
    <div className="first-time-popup">
        <div className="popup-text">
            <h2 className="first-time-title">This is your first time logging in.</h2>
            <h3 className="first-time-undertitle">You have to fill some information about yourself in order to help us recommend the events, you really wish to attend!</h3>
            <form>
                <input type="file" name="" id="profile-picture" />
                <select name="" id="interest">
                    <option value="">Drink</option>
                    <option value="">And</option>
                    <option value="">Drive</option>
                </select>
                <textarea name="" id="quote" cols="30" rows="10"></textarea>
                <input type='hidden' name='lat' id='lat'/>  
                <input type='hidden' name='lng' id='lng'/>
            </form>
        </div>
        <script src="http://maps.googleapis.com/maps/api/js?v=3&amp;sensor=false"></script>
        <script>
            google.maps.event.addDomListener(window, 'load', {initialize});
        </script>
    </div>
)

export default RegisterPopUp


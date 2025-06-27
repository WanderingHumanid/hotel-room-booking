import HotelList from './components/HotelList';
import RoomList from './components/RoomList';
import AddGuest from './components/AddGuest';
import BookRoom from './components/BookRoom';
import ViewBookings from './components/ViewBookings';

function App() {
  return (
    <div>
      <h1>Hotel Booking System</h1>
      <HotelList />
      <RoomList />
      <AddGuest />
      <BookRoom />
      <ViewBookings />
    </div>
  );
}

export default App;
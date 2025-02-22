import webbrowser
import os
import time
import unittest

class FamiliadaTest(unittest.TestCase):
    def setUp(self):
        self.current_dir = os.path.dirname(os.path.abspath(__file__))
        self.html_path = os.path.join(os.path.dirname(self.current_dir), 'index.html')

    def test_open_game(self):
        """Test otwierania gry w przeglądarce"""
        # Sprawdź czy plik HTML istnieje
        self.assertTrue(os.path.exists(self.html_path), "Plik index.html nie istnieje")
        
        # Otwórz grę w przeglądarce
        webbrowser.open('file://' + self.html_path)
        
        print("\nInstrukcja testowania manualnego:")
        print("1. Sprawdź czy tytuł 'Familiada' jest widoczny")
        print("2. Kliknij 'Pokaż pytanie' i sprawdź czy pytanie się pojawiło")
        print("3. Kliknij przycisk 'Pokaż' przy pierwszej odpowiedzi")
        print("4. Kliknij '+' przy pierwszej drużynie")
        print("5. Sprawdź czy punkty zostały dodane")
        print("6. Sprawdź czy przycisk 'Następne pytanie' jest widoczny")
        print("\nZamknij przeglądarkę po zakończeniu testów.")
        
        # Daj użytkownikowi czas na manualne sprawdzenie
        time.sleep(1)

if __name__ == '__main__':
    unittest.main()

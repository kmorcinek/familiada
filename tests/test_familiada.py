import os
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class FamiliadaTest(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()
        current_dir = os.path.dirname(os.path.abspath(__file__))
        self.html_path = os.path.join(os.path.dirname(current_dir), 'index.html')
        self.driver.get('file://' + self.html_path)
        self.wait = WebDriverWait(self.driver, 10)

    def tearDown(self):
        self.driver.quit()

    def test_automated_game_flow(self):
        """Automatyczny test przepływu gry"""
        try:
            # 1. Sprawdź tytuł
            title = self.driver.find_element(By.TAG_NAME, 'h1')
            self.assertEqual(title.text, 'Familiada')

            # 2. Kliknij 'Pokaż pytanie'
            show_question_btn = self.driver.find_element(By.ID, 'show-question-btn')
            show_question_btn.click()
            time.sleep(1)  # Poczekaj na animacje

            # Sprawdź czy pytanie jest widoczne
            question = self.driver.find_element(By.CLASS_NAME, 'question')
            self.assertTrue(question.is_displayed())

            # 3. Kliknij przycisk 'Pokaż' przy pierwszej odpowiedzi
            show_answer_btn = self.driver.find_element(By.ID, 'button-0')
            show_answer_btn.click()
            time.sleep(1)  # Poczekaj na dźwięk

            # 4. Kliknij '+' przy pierwszej drużynie
            add_points_btn = self.driver.find_element(By.ID, 'team1-add')
            add_points_btn.click()

            # 5. Sprawdź czy punkty zostały dodane
            team1_points = self.driver.find_element(By.ID, 'team1-points')
            self.assertNotEqual(team1_points.get_attribute('value'), '0')

            # 6. Sprawdź czy przycisk 'Następne pytanie' jest widoczny
            next_question_btn = self.driver.find_element(By.ID, 'next-question-btn')
            self.assertTrue(next_question_btn.is_displayed())

            # 7. Przejdź do następnego pytania
            next_question_btn.click()
            time.sleep(1)

            # 8. Sprawdź czy gra się zresetowała
            show_question_btn = self.driver.find_element(By.ID, 'show-question-btn')
            self.assertTrue(show_question_btn.is_displayed())

        except Exception as e:
            self.driver.save_screenshot('error.png')
            raise e

if __name__ == '__main__':
    unittest.main()

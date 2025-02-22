from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
import os

class FamiliadaTest(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()
        # Używamy ścieżki absolutnej do pliku HTML
        current_dir = os.path.dirname(os.path.abspath(__file__))
        html_path = os.path.join(os.path.dirname(current_dir), 'index.html')
        self.driver.get(f'file://{html_path}')
        self.wait = WebDriverWait(self.driver, 10)

    def tearDown(self):
        self.driver.quit()

    def test_basic_game_flow(self):
        """Test podstawowego przepływu gry"""
        # Sprawdź czy tytuł jest widoczny
        self.assertEqual(self.driver.find_element(By.TAG_NAME, 'h1').text, 'Familiada')

        # Sprawdź czy nazwy drużyn są poprawne
        team1_name = self.driver.find_element(By.CSS_SELECTOR, '.team1 .team-input').get_attribute('value')
        team2_name = self.driver.find_element(By.CSS_SELECTOR, '.team2 .team-input').get_attribute('value')
        self.assertEqual(team1_name, 'Drużyna 1')
        self.assertEqual(team2_name, 'Drużyna 2')

        # Kliknij przycisk "Pokaż pytanie"
        show_question_btn = self.driver.find_element(By.ID, 'show-question-btn')
        show_question_btn.click()

        # Sprawdź czy pytanie jest widoczne
        question = self.wait.until(
            EC.visibility_of_element_located((By.CLASS_NAME, 'question'))
        )
        self.assertTrue(question.is_displayed())

        # Pokaż pierwszą odpowiedź
        first_answer_btn = self.driver.find_element(By.ID, 'button-0')
        first_answer_btn.click()

        # Sprawdź czy odpowiedź jest widoczna
        first_answer = self.wait.until(
            EC.visibility_of_element_located((By.ID, 'answer-0'))
        )
        self.assertTrue(first_answer.is_displayed())

        # Dodaj punkty dla pierwszej drużyny
        team1_add_btn = self.driver.find_element(By.ID, 'team1-add')
        team1_add_btn.click()

        # Sprawdź czy punkty zostały dodane
        team1_points = self.driver.find_element(By.ID, 'team1-points').get_attribute('value')
        self.assertNotEqual(team1_points, '0')

        # Sprawdź czy przycisk następnego pytania jest widoczny
        next_question_btn = self.wait.until(
            EC.visibility_of_element_located((By.ID, 'next-question-btn'))
        )
        self.assertTrue(next_question_btn.is_displayed())

if __name__ == '__main__':
    unittest.main()

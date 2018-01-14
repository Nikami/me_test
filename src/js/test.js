$(function () {

  var $testContainer = $('#test-container');
  var $startBtn = $('#start-btn');
  var $nextBtn = $testContainer.find('#next-btn');
  var $restartBtn = $testContainer.find('#restart-btn');

  $startBtn.on('click', onStart);
  $nextBtn.on('click', onNext);
  $restartBtn.on('click', onRestart);
  $('.test-question__label').on('click', onRowClick);

  var results = [];
  var result = '';
  var qIdx = 1;
  var qLength = 7;
  var $activeQuestion = $('.test-question-' + qIdx);
  var $selectedAnswer = $activeQuestion.find('input[name=form-' + qIdx + ']:checked');
  var $results = $('#test-results');
  var $result = $results.find('.test-result-' + result);

  function onNext() {
    $selectedAnswer = $activeQuestion.find('input[name=form-' + qIdx + ']:checked');

    if ($selectedAnswer.length === 1) {
      results.push($selectedAnswer.val());

      if (qIdx < qLength) {
        qIdx++;
        $activeQuestion.removeClass('active');
        $activeQuestion.fadeOut();
        $selectedAnswer.parent().removeClass('selected');
        $selectedAnswer.prop('checked', false);
        $activeQuestion = $activeQuestion.next();
        $activeQuestion.fadeIn();
        $activeQuestion.addClass('active');
      } else if (qIdx === qLength) {
        $activeQuestion.removeClass('active');
        $activeQuestion.fadeOut();
        $selectedAnswer.parent().removeClass('selected');
        $selectedAnswer.prop('checked', false);
        $nextBtn.addClass('hidden');
        $restartBtn.removeClass('hidden');

        result = countResult(results);
        $result = $results.find('.test-result-' + result);
        $result.fadeIn();
      }
    } else {
      alert('Выберите вариант ответа!');
    }
  }

  function onStart() {
    $startBtn.parent().hide();
    $testContainer.fadeIn();
    $activeQuestion.fadeIn();
  }

  function onRestart() {
    $activeQuestion.removeClass('active');
    qIdx = 1;
    results = [];
    result = '';

    $activeQuestion = $('.test-question-' + qIdx);
    $activeQuestion.fadeIn().addClass('active');
    $result.fadeOut();
    $selectedAnswer = $activeQuestion.find('input[name=form-' + qIdx + ']:checked');
    $selectedAnswer.parent().removeClass('selected');
    $selectedAnswer.prop('checked', false);
    $nextBtn.removeClass('hidden');
    $restartBtn.addClass('hidden');
  }

  function onRowClick(event) {
    $activeQuestion.find('input[name=form-' + qIdx + ']:checked')
      .parent().removeClass('selected');

    $(event.target).parent()
      .addClass('selected')
      .find('input[type=radio]')
      .prop('checked', true);
  }

  function countResult(array) {
    if (array.length === 0) {
      return null;
    }

    var mf = 1;
    var m = 0;
    var item;

    for (var i = 0; i < array.length; i++) {
      for (var j = i; j < array.length; j++) {
        if (array[i] == array[j])
          m++;
        if (mf < m) {
          mf = m;
          item = array[i];
        }
      }
      m = 0;
    }

    return item;
  }
});
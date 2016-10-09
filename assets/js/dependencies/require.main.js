
//Mode local<script src="external/jquery/jquery.js"></script>
requirejs.config({
    paths: {
      'pnotify': 'pnotify.custom.min',
      'jquery' :    'jquery',
      'jquery-ui' : 'jquery-ui'

      
    },
    // Bootstrap is a "browser globals" script :-(
    shim: {
        'jquery-ui': {
            exports: '$'
        }
      },
      'jquery-ui': { deps: ['jquery']},
      
             
  });


/*

requirejs.config({
    paths: {
      'bootstrap': '{{ url("assets/local_dep/bootstrap.min") }}',
      'fuelux': '{{ url("assets/local_dep/fuelux.min") }}',
      'jquery': '{{ url("assets/local_dep/jquery") }}',
      'welcome': '{{ url("assets/js/welcome/welcome") }}',
      'chart': '{{ url("assets/local_dep/chart/Chart") }}',
     
    },

    shim: {
        'jquery': {
            exports: '$'
        },
        'bootstrap': { deps: ['jquery'] },
        'fuelux': { deps: ['bootstrap'] },
        'welcome': { deps: ['fuelux'] }, 
        'chart': { deps: ['bootstrap']}
            }
  });



*/

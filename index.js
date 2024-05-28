const { supervisor, supervisorPermisses } = require('./supervisor.js')
let supervisorPermissesBoolean = true

supervisorPermisses.on('fail', () => {
    supervisorPermissesBoolean = false
})

if (supervisorPermissesBoolean) {
    let timmybot
    let chalk
    
    if (supervisorPermissesBoolean) {
        try {
            chalk = require('fs')
            supervisor.succeed('fs module successfully loaded')
        } catch (err) {
            supervisor.fail(1, err, 'fs module failed to load')
        }
    }

    if (supervisorPermissesBoolean) {
        try {
            chalk = require('chalk')
            console.log(`[ ${chalk.green('OK')} ] chalk module successfully loaded`)
        } catch (err) {
            console.log(`chalk didn't not look ~_~!`)
        }
    }

    if (supervisorPermissesBoolean) {
        try {
            ({ timmybot } = require('./timmybot v1.0/scr/main.js'))
            supervisor.succeed('main.js successfully loaded')
        } catch (err) {
            supervisor.fail(1, err, 'failed to load main.js')
        }
    }

    if (supervisorPermissesBoolean) {
        try {
            timmybot.start()
        } catch (err) {
            supervisor.fail(1, err, 'l')
        }
    }

    supervisorPermisses.on('fullyOperational', () => {
        if (supervisorPermissesBoolean) {
        console.log(String.raw`
                       uuuuuuuuuuuuuuuuuuuuu.
                   .u$$$$$$$$$$$$$$$$$$$$$$$$$$W.
                 u$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$Wu.
               $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$i
              $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
             .$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
           .i$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$i
           $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$W
          .$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$W
         .$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$i
         #$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$.
         W$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$u       #$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$~
$#      '"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$i        $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$        #$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$         $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
#$.        $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$#
 $$      $iW$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$!
 $$i      $$$$$$$#"" '"""#$$$$$$$$$$$$$$$$$#""""""#$$$$$$$$$$$$$$$W
 #$$W    '$$$#"            "       !$$$$$'           '"#$$$$$$$$$$#
  $$$     ''                 ! !iuW$$$$$                 #$$$$$$$#
  #$$    $u                  $   $$$$$$$                  $$$$$$$~
   "#    #$$i.               #   $$$$$$$.                 '$$$$$$
          $$$$$i.                """#$$$$i.               .$$$$#
          $$$$$$$$!         .   '    $$$$$$$$$i           $$$$$
          '$$$$$  $iWW   .uW'        #$$$$$$$$$W.       .$$$$$$#
            "#$$$$$$$$$$$$#'          $$$$$$$$$$$iWiuuuW$$$$$$$$W
               !#""    ""             '$$$$$$$##$$$$$$$$$$$$$$$$
          i$$$$    .                   !$$$$$$ .$$$$$$$$$$$$$$$#
         $$$$$$$$$$'                    $$$$$$$$$Wi$$$$$$#"#$$'
         #$$$$$$$$$W.                   $$$$$$$$$$$#   ''
          '$$$$##$$$$!       i$u.  $. .i$$$$$$$$$#""
             "     '#W       $$$$$$$$$$$$$$$$$$$'      u$#
                            W$$$$$$$$$$$$$$$$$$      $$$$W
                            $$'!$$$##$$$$''$$$$      $$$$!
                           i$" $$$$  $$#"'  """     W$$$$
                                                   W$$$$!
                      uW$$  uu  uu.  $$$  $$$Wu#   $$$$$$
                     ~$$$$iu$$iu$$$uW$$! $$$$$$i .W$$$$$$
             ..  !   "#$$$$$$$$$$##$$$$$$$$$$$$$$$$$$$$#"
             $$W  $     "#$$$$$$$iW$$$$$$$$$$$$$$$$$$$$$W
             $#'   '       ""#$$$$$$$$$$$$$$$$$$$$$$$$$$$
                              !$$$$$$$$$$$$$$$$$$$$$#'
                              $$$$$$$$$$$$$$$$$$$$$$!
                            $$$$$$$$$$$$$$$$$$$$$$$'
                             $$$$$$$$$$$$$$$$$$$$"
                           ${chalk.bold.redBright('Timmy is ready to Rumble')}

        `)
        }
    })
}
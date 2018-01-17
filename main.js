( function( $$, Tumb ) {
    "use strict";

    $$( function() {
        function imageURLToRaw( url ) {
            let found = url.match( /\d+.media.(tumblr.com\/[a-fA-F0-9]+\/tumblr_[A-z0-9]+_)[0-9]+/ );

            if( found === null )
                return url;

            //raw url
            return 'http://data.' + found[1] + 'raw.' + url.split( '.' ).pop();
        }

        function resizeImages( newWidth ) {
            // console.log('/////////////// resizing images ///////////////');

            $$( '#left_column' ).find( '.post_container' ).each( function( index ) {
                let self = $$( this );

                let postMedia    = self.find( '.post_media' ); //parent
                let photosetRow  = postMedia.find( '.photoset_row' );
                //go through photoset and resize
                if( photosetRow.length > 0 ) {
                    photosetRow.each( function( index ) {
                        let photoRow = $$( this );

                        let widthStyle  = photoRow.css( 'width' );
                        let heightStyle = photoRow.css( 'height' );

                        if( widthStyle === undefined )
                            widthStyle  = '540px';
                        if( heightStyle === undefined )
                            heightStyle = '720px';

                        let img = photoRow.find( 'img' );
                        let ratio = parseInt( heightStyle, 10 ) / parseInt( widthStyle, 10 );

                        img.css( 'width', newWidth + 'px' );
                        img.css( 'height', newWidth * ratio );

                        photoRow.css( 'width', newWidth + 'px' );
                        photoRow.css( 'height', newWidth * ratio );

                        if( img.length > 0 ) {
                            let rawImg = imageURLToRaw( img.attr( 'src' ) );
                            img.attr( 'src', rawImg );
                        }
                    } );
                //single image just resize it
                } else {
                    let postMediaImg = postMedia.find( '.image' ); //when photoset present use .photoset_row when single image just .image
                    let widthStyle   = postMediaImg.css( 'width' );
                    let heightStyle  = postMediaImg.css( 'height' );

                    if( widthStyle === undefined )
                        widthStyle  = '540px';
                    if( heightStyle === undefined )
                        heightStyle = '720px';

                    let ratio = parseInt( heightStyle, 10 ) / parseInt( widthStyle, 10 );

                    postMediaImg.css( 'width', newWidth + 'px' );
                    postMediaImg.css( 'height', newWidth * ratio );

                    if( postMediaImg.length > 0 )
                        postMediaImg.attr( 'src', imageURLToRaw( postMediaImg.attr( 'src' ) ) );
                }
            } );
        }

        $$( 'head' ).append(
            '<style type="text/css">' +
                '#right_column { display:none; }' +
                '.post.post_full { width: calc(100% + 8px); }' +
                '.l-container.l-container--two-column-dashboard .left_column, .l-container.l-container--two-column .left_column { width: auto; }' +
                '.post-composer_note-post .note_item, .post_full.is_note .post-body .note_item, .post_full.is_note .post_body .note_item { width: calc( 100% - 55px ); }' +
                '.post_full.is_photoset .photoset .photoset_row, .post_full.is_photo .photoset .photoset_row { margin: 4px auto 0; }' +
            '</style>'
         );

        //compensate for padding on things
        let padding       = 8 * 2;
        let imageSubtract = parseInt( $$( '#posts' ).css( 'margin-left' ), 10 );
        let imageNewWidth = parseInt( $$( '#sidebar_footer_nav' ).css( 'width' ), 10 ) - imageSubtract - padding;
        
        //bind to the page loader after event
        Tumb.Events.on( 'AutoPaginator:after', function() {
            resizeImages( imageNewWidth );
        } );

        //fire off on initial load
        resizeImages( imageNewWidth );
    } );
} ) ( jQuery, Tumblr );
